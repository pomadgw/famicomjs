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

#[wasm_bindgen]
pub struct NES {
    bus: Bus,
    pub cpu: CPU,
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
}
