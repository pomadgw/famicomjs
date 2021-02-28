use crate::ppu::PPU;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Bus {
    ram: Vec<u8>,
    ppu: PPU,
}

#[wasm_bindgen]
impl Bus {
    pub fn new() -> Bus {
        Bus {
            ram: vec![0; 0x10000],
            ppu: PPU::new(),
        }
    }

    pub fn read(&self, address: u16) -> u8 {
        self.ram[address as usize]
    }

    pub fn write(&mut self, address: u16, value: u8) {
        self.ram[address as usize] = value;
    }
}

// // #[wasm_bindgen]
// impl IO for Bus {
//   fn read(&self, address: u16) -> u8 {
//     self.ram[address as usize]
//   }

//   fn write(&mut self, address: u16, value: u8) {
//     self.ram[address as usize] = value;
//   }
// }
