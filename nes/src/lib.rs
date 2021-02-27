mod utils;

pub mod cpu;
pub mod bus;
pub mod ppu;

use wasm_bindgen::prelude::*;
use bus::Bus;
use cpu::CPU;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub struct NES {
  bus: Bus,
  cpu: CPU
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
}
