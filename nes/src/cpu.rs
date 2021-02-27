use wasm_bindgen::prelude::*;

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
  pub P: u8
}

#[wasm_bindgen]
impl CPU {
  pub fn new() -> CPU {
    CPU {
      P: 0
    }
  }

  pub fn get_status(&self) -> u8 {
    self.P
  }
}
