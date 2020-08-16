# 6502: Addressing Modes

## Absolute Mode

This addressing mode is used to get value in memory by its absolute address.
The 6502 has 16-bit addressing bus, and therefore has the ability to access up to 64MB of memory. However, since 6502 is a 8-bit CPU, the address takes up 2 bytes.
Instructions using this addressing mode will use 3 bytes of memory.

For example, instruction `STA $0400` is represented in binary format as `8D 00 04`. Note that address is stored in little-endian order.
