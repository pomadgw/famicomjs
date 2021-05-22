use nesrs::memory::Memory;

pub struct Bus {
    ram: Vec<u8>,
}

impl Bus {
    pub fn new() -> Bus {
        Bus {
            ram: vec![0; 0x10000],
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
