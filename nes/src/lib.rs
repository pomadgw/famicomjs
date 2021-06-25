extern crate nesrs;
mod utils;

pub mod bus;
// pub mod cpu;
pub mod ppu;

use nesrs::bus::*;
use nesrs::ppu::*;
use nesrs::memory::Memory;
use wasm_bindgen::prelude::*;
use js_sys;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub fn get_screen_width() -> usize {
    NES_WIDTH_SIZE
}

#[wasm_bindgen]
pub fn get_screen_height() -> usize {
    NES_HEIGHT_SIZE
}

#[wasm_bindgen]
pub struct NES {
    bus: Bus,
}

#[wasm_bindgen]
impl NES {
    pub fn new(rom_data: js_sys::Uint8Array) -> NES {
        let mut data: Vec<u8> = Vec::new();
        data.resize(rom_data.length() as usize, 0);
        rom_data.copy_to(&mut data[..]);

        NES {
            bus: Bus::new_from_array(&data),
        }
    }

    pub fn clock(&mut self) {
        self.bus.clock();
    }

    pub fn reset(&mut self) {
        self.bus.reset();
    }

    pub fn read(&mut self, address: u16) -> u8 {
        self.bus.memory().read(address as usize, false)
    }

    pub fn write(&mut self, address: u16, value: u8) {
        self.bus.memory().write(address as usize, value);
    }

    pub fn is_cpu_done(&self) -> bool {
        self.bus.cpu.done()
    }

    pub fn toggle_debug(&mut self) {
        self.bus.cpu.debug = !self.bus.cpu.debug;
    }

    pub fn debug(&self) -> String {
        self.bus.cpu.debug()
    }

    pub fn change_pc(&mut self, pc: u16) {
        self.bus.cpu.regs.pc = pc;
    }

    pub fn get_screen_buffer_pointer(&self) -> *const u8 {
        get_screen_buffer_pointer()
    }
}
