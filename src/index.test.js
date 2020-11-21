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

jest.setTimeout(120000)

async function mockNES({
  filename,
  name = 'file.nes',
  type = 'application/octet-stream',
  lastModified = new Date()
} = {}) {
  const data = fs.readFileSync(filename)
  const blob = new Blob([data], { type })

  blob.lastModifiedDate = lastModified

  return new File([blob], name)
}

test('NES test', async () => {
  const nes = new Bus(new CPU(), new PPU(), () => {})
  const cart = new Cartridge()
  const cartFile = await mockNES({ filename: nesTestFile })
  await cart.parse(cartFile)
  nes.insertCartridge(cart)
  nes.reset()

  nes.cpu.PC = 0xc000
  nes.cpu.debugCurrentOpsPC = 0xc000

  const argsParam = argParamsGenerator(0xc000)

  const logTestFilename = resolve(__dirname, '../nestest.log')
  let logValue = ''
  const map = []

  let prevCycle
  for (let i = 0; i < 3 * 30000; i++) {
    logValue = ''
    nes.clock()
    const prevPC = nes.cpu.debugCurrentOpsPC
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
    logValue += `  A:${toHex(nes.cpu.A)}`
    logValue += ` X:${toHex(nes.cpu.X)}`
    logValue += ` Y:${toHex(nes.cpu.Y)}`
    logValue += ` P:${(+nes.cpu.STATUS).toString(2).padStart(8, '0')}`
    logValue += ` SP:${toHex(nes.cpu.SP)}`
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

  expect(nes.cpuRead(0x0002)).toBe(0)
  // expect(nes.cpu.ram[0x0003]).toBe(0) // for implementing undefined opcodes
})

const roms = fs.readdirSync(
  resolve(__dirname, '../roms/instr_test-v5/rom_singles')
)

console.log(roms)

roms.forEach((romFileName) => {
  const filename = resolve(
    __dirname,
    '../roms/instr_test-v5/rom_singles',
    romFileName
  )

  test(`NES test: ${romFileName}`, async () => {
    const nes = new Bus(new CPU(), new PPU(), () => {})
    const cart = new Cartridge()
    const cartFile = await mockNES({
      filename
    })
    await cart.parse(cartFile)
    nes.insertCartridge(cart)
    nes.reset()

    const statuses = []

    console.log('stating testing', romFileName)
    for (let i = 0; i < 3 * 1000000; i++) {
      nes.clock()
      const text = []
      let pos = 0x6004

      while (true) {
        const data = nes.cpuRead(pos)
        if (data === 0) break
        text.push(String.fromCharCode(data))
        pos++
      }

      if (text.length > 0) statuses.push(text.join(''))
    }

    while (nes.cpuRead(0x6000) >= 0x80) {
      nes.clock()
      const text = []
      let pos = 0x6004

      while (true) {
        const data = nes.cpuRead(pos)
        if (data === 0) break
        text.push(String.fromCharCode(data))
        pos++
      }

      if (text.length > 0) statuses.push(text.join(''))
    }

    console.log(statuses)

    expect(nes.cpuRead(0x6000)).toBe(0)
  })
})

test('NES test 2', async () => {
  const nes = new Bus(new CPU(), new PPU(), () => {})
  const cart = new Cartridge()
  const cartFile = await mockNES({
    filename: resolve(__dirname, '../roms/instr_test-v5/official_only.nes')
  })
  await cart.parse(cartFile)
  nes.insertCartridge(cart)
  nes.reset()

  const statuses = []

  for (let i = 0; i < 3 * 1000000; i++) {
    nes.clock()
    const text = []
    let pos = 0x6004

    while (true) {
      const data = nes.cpuRead(pos)
      if (data === 0) break
      text.push(String.fromCharCode(data))
      pos++
    }

    if (text.length > 0) statuses.push(text.join(''))
  }

  while (nes.cpuRead(0x6000) === 0x80) {
    nes.clock()
    const text = []
    let pos = 0x6004

    while (true) {
      const data = nes.cpuRead(pos)
      if (data === 0) break
      text.push(String.fromCharCode(data))
      pos++
    }

    if (text.length > 0) statuses.push(text.join(''))
  }

  console.log(statuses[statuses.length - 1])

  expect(nes.cpuRead(0x6000)).toBe(0)
})
