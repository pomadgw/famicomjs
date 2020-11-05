import fs from 'fs'
import { resolve } from 'path'
import Cartridge from './cartridge'
import Bus from './bus'
import CPU from './6502'
import PPU from './ppu'

import disassember from './6502/disassembler'
import toHex from './utils/tohex'

const nesTestFile = resolve(__dirname, '../nestest.nes')

jest.setTimeout(60000)

async function mockNES({
  name = 'file.nes',
  type = 'application/octet-stream',
  lastModified = new Date()
} = {}) {
  const data = fs.readFileSync(nesTestFile)
  const blob = new Blob([data], { type })

  blob.lastModifiedDate = lastModified

  return new File([blob], name)
}

test('NES test', async () => {
  const nes = new Bus(new CPU(), new PPU(), { onRender: () => {} })
  const cart = new Cartridge()
  const cartFile = await mockNES()
  await cart.parse(cartFile)
  nes.insertCartridge(cart)
  nes.reset()
  nes.cpu.isDebug = true

  nes.cpu.registers.PC = 0xc000

  const logTestFilename = resolve(__dirname, '../nestest.log')
  let logValue = ''
  for (let i = 0; i < 3 * 39860; i++) {
    nes.clock()
  }

  nes.cpu.debugData.opcodes.forEach((e) => {
    const disassembled = disassember(e.instructions, {
      binaryStart: e.pc,
      showOnlyTargetAddress: true
    })
    e.asm = Object.values(disassembled)[0] ?? '-'

    if (e.valueToWrite != null) {
      e.asm += ` = ${toHex(e.valueToWrite)}`
    }
  })

  logValue = nes.cpu.debugData.opcodes
    .map((e) => {
      let pattern = ''

      pattern += toHex(e.pc, { length: 4 })
      pattern += `  ${e.instructions
        .map((num) => toHex(num))
        .join(' ')
        .padEnd(8, ' ')}`
      pattern += `  ${e.asm.padEnd(32, ' ')}`
      pattern += `  A:${toHex(e.A)}`
      pattern += ` X:${toHex(e.X)}`
      pattern += ` Y:${toHex(e.Y)}`
      pattern += ` P:${toHex(e.P)}`
      pattern += ` SP:${toHex(e.SP)}`
      pattern += ` PPU:${e.ppu.scanline
        .toString()
        .padStart(3, ' ')},${e.ppu.cycle.toString().padStart(3, ' ')}`
      pattern += ` CYC: ${e.cycles}`

      return pattern
    })
    .join('\n')

  fs.writeFileSync(logTestFilename, logValue)

  expect(nes.cpu.ram[0x0002]).toBe(0)
  // expect(nes.cpu.ram[0x0003]).toBe(0) // for implementing undefined opcodes
})
