import fs from 'fs'
import assembler from '../src/6502/assembler/index'

import yargs from 'yargs'

const { argv } = yargs
  .command('[filename]', 'assembler 6502 source file', (yargs) => {
    yargs.positional('filename', {
      describe: 'source filename'
    })
  })
  .option('output', {
    alias: 'o',
    type: 'string',
    description: 'output filename'
  })

const as6502 = assembler({ memorySize: 0x10000, PC: 0x8000 })

const sourceFile = fs.readFileSync(argv._[0], { encoding: 'utf8' })

const result = as6502([sourceFile])

result[0xfffc] = 0x00
result[0xfffd] = 0x80

fs.writeFileSync(argv.output ?? 'result.bin', result)
