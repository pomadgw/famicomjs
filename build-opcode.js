/* eslint-disable camelcase */
/**
 * This script generates opcode tables
 */
const parser = require('@babel/parser')
const generate = require('@babel/generator').default
const glob = require('glob')
const fs = require('fs')
const opcodes = require('./src/6502/instructions/opcodes.json')

glob('src/6502/instructions/operations/*.js', (err, files) => {
  if (err) {
    console.error(err)
    return
  }

  // filter test files
  const filtered = files.filter((e) => !/\.test\.js$/.test(e))
  const implementedOpcodes = []
  const implementedOpcodesObj = {}

  // lists implemented opcodes
  filtered.forEach((path) => {
    implementedOpcodesObj[path] = []
    const content = fs.readFileSync(path, { encoding: 'utf8' })
    const parsed = parser.parse(content, { sourceType: 'module' })
    parsed.program.body
      .filter((node) => node.type === 'ExportNamedDeclaration')
      .forEach((node) => {
        const name = node.declaration.id
          ? node.declaration.id.name
          : node.declaration.declarations[0].id.name
        implementedOpcodes.push(name)
        implementedOpcodesObj[path].push(name)
      })
  })

  // create template
  const parsed = parser.parse(
    `
import ABS from './addressings/absolute'
import REL from './addressings/relative'
import IMM from './addressings/immediate'
import IND from './addressings/indirect'
import IZX from './addressings/indexed-indirect'
import IZY from './addressings/indirect-indexed'
import ZP0 from './addressings/zero-page'
import IMP from './addressings/implicit'

${Object.entries(implementedOpcodesObj)
  .map(([path, imports]) => {
    const importedPath = path
      .replace('src/6502/instructions', '.')
      .replace('.js', '')
    const mapped = `{ ${imports.join(', ')} }`
    return `import ${mapped} from '${importedPath}'`
  })
  .join('\n')}

const ABX = (cpu) => ABS(cpu, 'X')
const ABY = (cpu) => ABS(cpu, 'Y')
const ZPX = (cpu) => ZP0(cpu, 'X')
const ZPY = (cpu) => ZP0(cpu, 'Y')

const XXX = () => 0

export default {
  0x00: {
    name: 'BRK',
    operator: BRK,
    addressing: IMP,
    cycles: 1
  }
}
  `,
    { sourceType: 'module' }
  )

  const exportNode = parsed.program.body[parsed.program.body.length - 1]

  // remove dummy entry
  exportNode.declaration.properties.pop()

  // add new entries to the object
  opcodes.forEach(({ name, operate, addr_mode, cycles }, index) => {
    const opKey = operate.toUpperCase()
    const operator = implementedOpcodes.includes(opKey) ? opKey : 'XXX'
    const intendedBody = parser.parse(`const x = {
      0x${index.toString(16).padStart(2, '0')}: {
        name: '${name}',
        operator: ${operator},
        addressing: ${addr_mode},
        cycles: ${cycles}
      }
    }`)

    exportNode.declaration.properties.push(
      intendedBody.program.body[0].declarations[0].init.properties[0]
    )
  })

  // generate the file
  fs.writeFileSync('src/6502/instructions/index.js', generate(parsed).code)
})
