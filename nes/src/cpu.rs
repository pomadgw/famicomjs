use wasm_bindgen::prelude::*;
use crate::bus::Bus;

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Status {
    C = 0x01,
    Z = 0x02,
    I = 0x04,
    D = 0x08,
    B = 0x10,
    U = 0x20,
    V = 0x40,
    N = 0x80,
}

#[wasm_bindgen]
pub struct CPU {
  pub a: u8,
  pub x: u8,
  pub y: u8,
  pub sp: u8,
  pub pc: u16,
  pub p: u8
}

#[wasm_bindgen]
impl CPU {
  pub fn new() -> CPU {
    CPU {
      a: 0,
      x: 0,
      y: 0,
      pc: 0,
      sp: 0,
      p: 0
    }
  }

  pub fn get_status(&self) -> u8 {
    self.p
  }

  pub fn clock(&mut self, bus: &mut Bus) {
    //
  }
}
