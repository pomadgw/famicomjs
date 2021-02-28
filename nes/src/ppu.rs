use wasm_bindgen::prelude::*;

const NES_WIDTH_SIZE: usize = 256;
const NES_HEIGHT_SIZE: usize = 240;
const NES_SCREEN_BUFFER_SIZE: usize = NES_WIDTH_SIZE * NES_HEIGHT_SIZE * 4;

static mut NES_SCREEN_BUFFER: [u8; NES_SCREEN_BUFFER_SIZE] = [0; NES_SCREEN_BUFFER_SIZE];

// Function to return a pointer to our buffer
// in wasm memory
#[wasm_bindgen]
pub fn get_nes_screen_buffer_pointer() -> *const u8 {
    let pointer: *const u8;
    unsafe {
        pointer = NES_SCREEN_BUFFER.as_ptr();
    }

    return pointer;
}

#[wasm_bindgen]
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
