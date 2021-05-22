use crate::ppu::PPU;
use nesrs::memory::Memory;

pub struct Bus {
    ram: Vec<u8>,
    ppu: PPU,
}

impl Bus {
    pub fn new() -> Bus {
        Bus {
            ram: vec![0; 0x10000],
            ppu: PPU::new(),
        }
    }
}

impl Memory for Bus {
    fn read(&self, address: usize, _is_read_only: bool) -> u8 {
        self.ram[address]
    }

    fn write(&mut self, address: usize, value: u8) {
        self.ram[address] = value;
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
