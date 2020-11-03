import fs from 'fs'
import { resolve } from 'path'
import Cartridge from './cartridge'
import Bus from './bus'
import CPU from './6502'
import opcodes from './6502/instructions'
import PPU from './ppu'

import disassember, { argParamsGenerator } from './6502/disassembler'
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
  const nes = new Bus(new CPU(), new PPU())
  const cart = new Cartridge()
  const cartFile = await mockNES()
  await cart.parse(cartFile)
  nes.insertCartridge(cart)
  nes.reset()

  nes.cpu.registers.PC = 0xc000
  nes.cpu.debugCurrentOps.pc = 0xc000
  nes.cpu.registers.STATUS.status = 0x24

  const argsParam = argParamsGenerator(0xc000)

  const logTestFilename = resolve(__dirname, '../nestest.log')
  let logValue = ''
  const map = []

  let prevCycle
  for (let i = 0; i < 3 * 27000; i++) {
    logValue = ''
    nes.clock()
    const prevPC = nes.cpu.debugCurrentOps.pc
    prevCycle = nes.cpu.debugCycles

    const disassembled = disassember(nes.cpu.debugCurrentOps, {
      binaryStart: prevPC
    })

    logValue += toHex(prevPC, { length: 4 })

    const argLength = argsParam[opcodes[nes.cpu.opcode].addressingName].length
    const disassembledInstruction = (
      disassembled[`$${toHex(prevPC, { length: 4 })}`] ?? '-'
    ).padEnd(30, ' ')

    // if (nes.cpu.isComplete) {
    logValue += `  ${nes.cpu.debugCurrentOps
      .slice(0, argLength + 1)
      .map(toHex)
      .join(' ')
      .padEnd(8, ' ')}`
    logValue += `  ${disassembledInstruction}`
    logValue += `  A:${toHex(nes.cpu.registers.A)}`
    logValue += ` X:${toHex(nes.cpu.registers.X)}`
    logValue += ` Y:${toHex(nes.cpu.registers.Y)}`
    logValue += ` P:${toHex(+nes.cpu.registers.STATUS)}`
    logValue += ` SP:${toHex(nes.cpu.registers.SP)}`
    logValue += ` PPU:${nes.ppu.scanline.toString().padStart(3, ' ')}`
    logValue += `,${(nes.ppu.cycle - 1).toString().padStart(3, ' ')}`
    logValue += ` CYC:${prevCycle}`
    logValue += '\n'
    map.push([prevPC, disassembledInstruction, logValue])
    // }
  }

  const logValue2 = []

  let prevPC
  for (let i = 0; i < map.length; i++) {
    const curr = map[i]
    if (curr[1].trim() === '-') {
      continue
    }
    if (!prevPC || prevPC !== curr[0]) {
      logValue2.push(curr[2])
    }

    prevPC = curr[0]
  }

  logValue = logValue2.join('')

  fs.writeFileSync(logTestFilename, logValue)

  expect(nes.cpu.ram[0x0002]).toBe(0)
  // expect(nes.cpu.ram[0x0003]).toBe(0) // for implementing undefined opcodes
})
