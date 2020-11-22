import fs from 'fs'
import path from 'path'

import Cartridge from './src/cartridge'
import Bus from './src/bus'
import CPU from './src/6502'
import opcodes from './src/6502/instructions'
import PPU from './src/ppu'

import disassember, { argParamsGenerator } from './src/6502/disassembler'
import toHex from './src/utils/tohex'

const filename = process.argv[2]
const clockNumbers = process.argv[3] ? Number(process.argv[3]) : 3 * 30000

const buffer = fs.readFileSync(filename)

const nes = new Bus(new CPU(), new PPU(), () => {})
const cart = new Cartridge()

cart.parse(buffer)
nes.insertCartridge(cart)
nes.reset()

const argsParam = argParamsGenerator(nes.cpu.PC)

const logTestFilename = path.resolve(__dirname, './log.log')
let logTempData = ''
const map = []

let prevCycle
let ram

for (let i = 0; i < clockNumbers; i++) {
  logTempData = ''

  const prevPC = nes.cpu.debugCurrentOpsPC
  prevCycle = nes.cpu.debugCycles - 1

  let prevRegsAdnCycles = ''
  prevRegsAdnCycles += `  A:${toHex(nes.cpu.A)}`
  prevRegsAdnCycles += ` X:${toHex(nes.cpu.X)}`
  prevRegsAdnCycles += ` Y:${toHex(nes.cpu.Y)}`
  // prevRegsAdnCycles += ` P:${(+nes.cpu.STATUS).toString(2).padStart(2, '0')}`
  prevRegsAdnCycles += ` P:${toHex(+nes.cpu.STATUS)}`
  prevRegsAdnCycles += ` SP:${toHex(nes.cpu.SP)}`
  prevRegsAdnCycles += ` PPU:${(nes.ppu.cycle - 1).toString().padStart(3, ' ')}`
  prevRegsAdnCycles += `,${nes.ppu.scanline.toString().padStart(3, ' ')}`
  prevRegsAdnCycles += ` CYC:${prevCycle}`

  nes.clock()

  if (nes.cpu.clocks === 0 && nes.globalSystemClockNumber % 3 === 0) {
    // process.stderr.clearLine()
    // process.stderr.cursorTo(0)
    // process.stderr.write(
    //   `Cycle ${i.toString().padStart(7, ' ')} of ${clockNumbers}\n`
    // )

    const disassembled = disassember(nes.cpu.debugCurrentOps, {
      binaryStart: prevPC,
      nintendulatorFormat: true,
      ram,
      registers: {
        A: nes.cpu.A,
        X: nes.cpu.X,
        Y: nes.cpu.Y
      }
    })

    logTempData += toHex(prevPC, { length: 4 })

    const argLength = argsParam[opcodes[nes.cpu.opcode].addressingName].length
    const disassembledInstruction = (
      disassembled[`$${toHex(prevPC, { length: 4 })}`] ?? '-'
    ).padEnd(30, ' ')

    logTempData += `  ${nes.cpu.debugCurrentOps
      .slice(0, argLength + 1)
      .map(toHex)
      .join(' ')
      .padEnd(8, ' ')}`
    logTempData += `  ${disassembledInstruction}`
    logTempData += prevRegsAdnCycles
    logTempData += '\n'
    map.push([prevPC, disassembledInstruction, logTempData])
    process.stdout.write(logTempData)

    ram = nes.getRAMSnapshot(0)
  }
}

const temp = map.map((e) => e[2]) // []

// let prevPC
// for (let i = 0; i < map.length; i++) {
//   const curr = map[i]
//   if (curr[1].trim() === '-') {
//     continue
//   }
//   if (!prevPC || prevPC !== curr[0]) {
//     temp.push(curr[2])
//   }

//   prevPC = curr[0]
// }

logTempData = temp.join('')

fs.writeFileSync(logTestFilename, logTempData)
