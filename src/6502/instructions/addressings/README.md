# 6502: Addressing Modes

## Implicit
Instructions using this mode doesn't use any of external value (register and memory). Source and destination of
the instruction is implied directly by its function. The instruction length will be only one byte (the opcode only).

For example, instruction `BRK` is represented in binary format simply as `00`.

## Accumulator

Instructions using this mode (not really an addressing mode) will be able to directly operate on the accumulator (register `A`). Since it is implied that accumulator is the source and destination of the operation, the instruction length will be only one byte (the opcode only).

For example, instruction `ASL A` is represented in binary format simply as `0A`.

### Instructions

| Opcode | Instruction |
| ------ | ----------- |
| 0A     | ASL A | 

## Absolute

This addressing mode is used to get value in memory by its absolute address.
The 6502 has 16-bit addressing bus, and therefore has the ability to access up to 64MB of memory. However, since 6502 is a 8-bit CPU, the address takes up 2 bytes.
Instructions using this mode will use 3 bytes of memory consisting of first byte for opcode and 2 bytes (16 bit) for operand.

For example, instruction `STA $0400` is represented in binary format as `8D 00 04`. Note that address is stored in little-endian order.

There are also *indexed absolute* where the absolute address is obtained by adding the operand with value of register `X` or `Y`. For example, `STA $0400,X` with register `X` valued `$02` will store accumulator value to address `$0402`.

### Instructions

| Opcode | Instruction |
| ------ | ----------- |
| 0D     | `ORA $0400` |
| 0E     | `ASL $0400` |
| 19     | `ORA $0400,Y` |
| 1D     | `ORA $0400,X` |
| 1E     | `ASL $0400,X` |
| 20     | `JSR $0400` |
| 2C     | `BIT $0400` |
| 2D     | `AND $0400` |
| 2E     | `ROL $0400` |
| 39     | `AND $0400,Y` |
| 3D     | `AND $0400,X` |
| 3E     | `ROL $0400,X` |


## Zero Page

This addressing mode is used to access first 256 bytes of memory. In effect, this mode is similar to absolute mode except that the high byte is always set to $00. Instructions using this mode will use only 2 bytes of memory consisting of first byte for opcode and another byte (8 bit) for operand.

For example, instruction `STA $04` is represented in binary format as `85 04`.

## Source

- http://www.obelisk.me.uk/6502/addressing.html
