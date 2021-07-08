pub struct PPU {
    pub address: u16,
}

impl PPU {
    pub fn new() -> PPU {
        PPU { address: 0 }
    }
}
