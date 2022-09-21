extern crate nes;

mod utils;

use cpurs::CPU;
use nes::bus::*;
use nes::ppu::*;
use nes::controller::ButtonStatus;
use ::utils::memory::Memory;
use ::utils::saveable::Saveable;
use wasm_bindgen::prelude::*;
use js_sys;
use web_sys;
use std::io::Cursor;

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
    bus: Nes,
    screenbuffer: Vec<u8>,

    audio_time: f32,
    audio_buffer: Vec<f32>,

    save_data: Vec<u8>,
}

#[wasm_bindgen]
impl NES {
    pub fn new(rom_data: js_sys::Uint8Array) -> NES {
        let mut data: Vec<u8> = Vec::new();
        data.resize(rom_data.length() as usize, 0);
        rom_data.copy_to(&mut data[..]);

        NES {
            bus: Nes::new_from_array(&data).unwrap(),
            screenbuffer: vec![0; NES_WIDTH_SIZE * NES_HEIGHT_SIZE * 4],
            audio_time: 0.0,
            audio_buffer: vec![0.0; 128],
            save_data: Vec::new(),
        }
    }

    pub fn replace_cartridge(&mut self, rom_data: js_sys::Uint8Array) {
        let mut data: Vec<u8> = Vec::new();
        data.resize(rom_data.length() as usize, 0);
        rom_data.copy_to(&mut data[..]);

        self.bus.replace_cartridge_with_array(&data).unwrap();
    }

    pub fn set_sample_rate(&mut self, rate: u32  ) {
        self.bus.set_audio_sample_rate(rate)
    }

    pub fn clock(&mut self) {
        self.bus.clock();

        if self.bus.is_done_drawing() {
            self.bus.copy_framebuffer_on_done_drawing(&mut self.screenbuffer);
            web_sys::console::log_1(&"done drawing".into());
        }
    }

    pub fn sin(&mut self) -> f32 {
        self.audio_time += 1.0 / 44100.0;
        
        (self.audio_time * 440.0 * 2.0 * 3.1415).sin() * 0.5
    }

    pub fn clock_until_frame_done(&mut self) {
        self.bus.clock_until_frame_done();
    }

    pub fn clock_until_audio_ready(&mut self) -> f32 {
        let audio = self.bus.clock_until_audio_ready();
        self.bus.copy_framebuffer(&mut self.screenbuffer);
        audio
    }

    pub fn clock_until_audio_ready_2(&mut self) {
        for buffer in self.audio_buffer.iter_mut() {
            *buffer = self.bus.clock_until_audio_ready();
        }

        self.bus.copy_framebuffer_on_done_drawing(&mut self.screenbuffer);
    }

    pub fn get_audio_buffer_pointer(&mut self) -> *const f32 {
        self.audio_buffer.as_ptr()
    }

    pub fn get_audio_buffer_len(&self) -> usize {
        self.audio_buffer.len()
    }

    pub fn cpu_total_cycles(&self) -> u32 {
        self.bus.cpu_total_cycles()
    }

    pub fn audio_output(&mut self) -> f32 {
        self.bus.audio_output
    }

    pub fn done_drawing(&self) -> bool {
      self.bus.is_done_drawing()
    }

    pub fn reset(&mut self) {
        self.bus.reset();
    }

    pub fn read(&mut self, address: u16) -> u8 {
        self.bus.memory().memory_read(address.into(), false)
    }

    pub fn write(&mut self, address: u16, value: u8) {
        self.bus.memory().memory_write(address.into(), value);
    }

    pub fn is_cpu_done(&self) -> bool {
        self.bus.cpu.done()
    }

    pub fn toggle_debug(&mut self) {
        self.bus.cpu.debug = !self.bus.cpu.debug;
    }

    pub fn debug(&self) -> String {
        self.bus.cpu.debug_str().to_string()
    }

    pub fn change_pc(&mut self, pc: u16) {
        self.bus.cpu.pc = pc;
    }

    pub fn press_button(&mut self, id: usize, button: u8, status: bool) {
        self.bus.press_controller_button(id, ButtonStatus::from_bits(button).unwrap(), status);
    }

    pub fn get_screen_buffer_pointer(&mut self) -> *const u8 {
        self.screenbuffer.as_ptr()
    }

    pub fn get_screen_buffer_len(&self) -> usize {
        self.screenbuffer.len()
    }

    pub fn get_save_data_pointer(&mut self) -> *const u8 {
        self.save_data.as_ptr()
    }

    pub fn get_save_data_len(&self) -> usize {
        self.save_data.len()
    }

    pub fn set_pause(&mut self, value: bool) {
        self.bus.pause = value;
    }

    pub fn pause(&self) -> bool {
        self.bus.pause
    }

    pub fn pc(&self) -> u16 {
        self.bus.cpu.pc
    }

    pub fn get_save_data(&mut self) {
        let mut data: Vec<u8> = Vec::new();

        self.bus.save(&mut data);

        self.save_data = data;
    }

    pub fn load_save_data(&mut self, save_data: js_sys::Uint8Array) {
        let mut data: Vec<u8> = Vec::new();
        data.resize(save_data.length() as usize, 0);
        save_data.copy_to(&mut data[..]);
        let mut cursor = Cursor::new(data);

        self.bus.load(&mut cursor);
    }
}
