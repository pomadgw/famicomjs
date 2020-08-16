# 6502: Addressing Modes

## Absolute Mode

This addressing mode is used to get value in memory by its absolute address.
The 6502 has 16-bit addressing bus, and therefore has the ability to access up to 64MB of memory. However, since 6502 is a 8-bit CPU, the address takes up 2 bytes.
Instructions using this mode will use 3 bytes of memory consisting of first byte for opcode and 2 bytes (16 bit) for operand.

For example, instruction `STA $0400` is represented in binary format as `8D 00 04`. Note that address is stored in little-endian order.

| Opcode | Instruction |
------------------------
| 0D     | ORA         | 


## Zero Page

This addressing mode is used to access first 256 bytes of memory. In effect, this mode is similar to absolute mode except that the high byte is always set to $00. Instructions using this mode will use only 2 bytes of memory consisting of first byte for opcode and another byte (8 bit) for operand.

For example, instruction `STA $04` is represented in binary format as `85 04`.