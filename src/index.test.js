import fs from 'fs'
import { resolve } from 'path'
import Cartridge from './cartridge'
import Bus from './bus'
import CPU from './6502'
import PPU from './ppu'

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

  for (let i = 0; i < 3 * 20000; i++) {
    nes.clock()
  }

  expect(nes.cpu.ram[0x0002]).toBe(0)
  // expect(nes.cpu.ram[0x0003]).toBe(0) // for implementing undefined opcodes
})
