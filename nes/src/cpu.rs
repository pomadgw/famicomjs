use crate::bus::Bus;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Status {
    C = 0x01,
    Z = 0x02,
    I = 0x04,
    D = 0x08,
    B = 0x10,
    U = 0x20,
    V = 0x40,
    N = 0x80,
}

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum IrqType {
    Reset = 0x01,
    Nmi = 0x02,
    External = 0x04,
    APUFrame = 0x08,
    APUDPCM = 0x10,
}

#[wasm_bindgen]
#[derive(Clone, Copy, Debug)]
pub struct CPU {
    pub a: u8,
    pub x: u8,
    pub y: u8,
    pub sp: u8,
    pub pc: u16,
    pub p: u8,

    pub sync: bool,
    current_opcode: u8,
    steps: u8,
    irq_triggers: u8,

    pub cycles: i32,
}

macro_rules! fetch_opcode_at {
    ($self:expr, $num:expr) => {
        if $self.steps == $num - 1 {
            $self.sync = true;
        }
    };
}

macro_rules! to_word {
    ($lo:expr, $hi:expr) => {
        ($hi << 8) | $lo
    };
}

#[wasm_bindgen]
impl CPU {
    pub fn new() -> CPU {
        CPU {
            a: 0,
            x: 0,
            y: 0,
            pc: 0,
            sp: 0,
            p: 0,

            sync: true,
            current_opcode: 0,
            steps: 0,
            cycles: 0,

            irq_triggers: 0,
        }
    }

    pub fn get_status(&self) -> u8 {
        self.p
    }

    pub fn trigger_irq(&mut self, trigger: IrqType) {
        self.irq_triggers |= trigger as u8;
    }

    pub fn clear_irq(&mut self, trigger: IrqType) {
        self.irq_triggers &= !(trigger as u8);
    }

    pub fn is_irq_on(&self, trigger: IrqType) -> bool {
        (self.irq_triggers & (trigger as u8)) != 0
    }

    fn has_interrupts(&self, irq_status: bool) -> bool {
        self.irq_triggers != 0 && irq_status
    }

    pub fn reset(&mut self) {
        self.trigger_irq(IrqType::Reset);
        self.sync = true;
    }

    pub fn clock(&mut self, bus: &mut Bus) {
        if self.sync {
            self.sync = false;
            if self.is_irq_on(IrqType::Reset) {
                self.current_opcode = 0x00;
            } else {
                self.current_opcode = bus.read(self.next_pc());
            }
        }

        match self.current_opcode {
            // BRK
            0x00 => {
                if self.steps == 0 {
                    let hi = (self.pc >> 8) & 0xff;
                    let lo = self.pc & 0xff;

                    if self.is_irq_on(IrqType::Reset) {
                        self.push_stack(0, bus);
                        self.push_stack(0, bus);
                    } else {
                        self.push_stack(hi as u8, bus);
                        self.push_stack(lo as u8, bus);
                    }

                    self.set_flag(Status::B, true);
                    self.set_flag(Status::U, true);

                    if self.is_irq_on(IrqType::Reset) {
                        self.push_stack(0, bus);
                    } else {
                        self.push_stack(self.p, bus);
                        self.set_flag(Status::U, false);
                    }

                    self.set_flag(Status::B, false);
                    self.set_flag(Status::I, true);

                    let vector_address: u16 = if self.is_irq_on(IrqType::Reset) {
                        0xfffc
                    } else if self.is_irq_on(IrqType::Nmi) {
                        0xfffa
                    } else {
                        0xfffe
                    };

                    let lo = bus.read(vector_address) as u16;
                    let hi = bus.read(vector_address + 1) as u16;

                    self.pc = to_word!(lo, hi);

                    if self.is_irq_on(IrqType::Reset) {
                        self.clear_irq(IrqType::Reset);
                    }

                    if self.is_irq_on(IrqType::Nmi) {
                        self.clear_irq(IrqType::Nmi);
                    }
                }

                fetch_opcode_at!(self, 7);
            }
            _ => {}
        }

        self.steps += 1;
        self.cycles += 1;
    }

    fn next_pc(&mut self) -> u16 {
        let current_pc = self.pc;
        self.pc = self.pc.wrapping_add(1);

        current_pc
    }

    fn get_flag(&self, flag: Status) -> bool {
        (self.p & (flag as u8)) != 0
    }

    fn set_flag(&mut self, flag: Status, value: bool) {
        self.p &= !(flag as u8);
        if value {
            self.p |= flag as u8;
        }
    }

    fn push_stack(&mut self, value: u8, bus: &mut Bus) {
        let address = 0x100 + (self.sp as u16);
        self.sp = self.sp.wrapping_sub(1);

        bus.write(address, value);
    }
}
