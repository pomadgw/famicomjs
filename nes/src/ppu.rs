pub const NES_WIDTH_SIZE: usize = 256;
pub const NES_HEIGHT_SIZE: usize = 240;
const NES_SCREEN_BUFFER_SIZE: usize = NES_WIDTH_SIZE * NES_HEIGHT_SIZE * 4;

pub static mut NES_SCREEN_BUFFER: [u8; NES_SCREEN_BUFFER_SIZE] = [0; NES_SCREEN_BUFFER_SIZE];

pub struct PPU {
    pub address: u16,
}

impl PPU {
    pub fn new() -> PPU {
        PPU { address: 0 }
    }

    pub fn set_buffer(address: usize, value: u8) {
        unsafe {
            NES_SCREEN_BUFFER[address] = value;
        }
    }
}
