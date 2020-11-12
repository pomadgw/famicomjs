import fs from 'fs'
import assembler from '../src/6502/assembler/newindex'

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

const sourceFile = fs.readFileSync(argv._[0], { encoding: 'utf8' })
const result = assembler(sourceFile)
fs.writeFileSync(argv.output ?? 'result.bin', new Uint8Array(result))
