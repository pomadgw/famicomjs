mod utils;

pub mod bus;
pub mod cpu;
pub mod ppu;

use bus::Bus;
use cpu::CPU;
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// Function to return a pointer to our buffer
// in wasm memory
#[wasm_bindgen]
pub fn get_nes_screen_buffer_pointer() -> *const u8 {
    let pointer: *const u8;
    unsafe {
        pointer = ppu::NES_SCREEN_BUFFER.as_ptr();
    }

    return pointer;
}

#[wasm_bindgen]
pub struct NES {
    bus: Bus,
    cpu: CPU,
}

#[wasm_bindgen]
impl NES {
    pub fn new() -> NES {
        NES {
            bus: Bus::new(),
            cpu: CPU::new(),
        }
    }

    pub fn clock(&mut self) {
        self.cpu.clock(&mut self.bus);
    }

    pub fn reset(&mut self) {
        self.cpu.reset();
    }

    pub fn read(&self, address: u16) -> u8 {
        self.bus.read(address)
    }

    pub fn write(&mut self, address: u16, value: u8) {
        self.bus.write(address, value);
    }

    pub fn is_cpu_done(&self) -> bool {
        self.cpu.sync
    }

    pub fn debug(&self) -> String {
        String::from(format!(
            "{:04X} A: ${:02X} X: ${:02X} Y: ${:02X} SP: ${:02X} P: ${:02X}",
            self.cpu.pc, self.cpu.a, self.cpu.x, self.cpu.y, self.cpu.sp, self.cpu.p
        ))
    }
}
