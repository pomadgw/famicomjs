/* eslint-disable camelcase */
const yaml = require('yaml')
const mustache = require('mustache')
const fs = require('fs')
const path = require('path')
const opcodes = require('./opcodes.json')

const addrmodeDefs = yaml.parse(
  fs.readFileSync(path.resolve(__dirname, './addressing.yml'), {
    encoding: 'utf8'
  })
)

const opcodeDefs = yaml.parse(
  fs.readFileSync(path.resolve(__dirname, './opcodes.yml'), {
    encoding: 'utf8'
  })
)

const template = fs.readFileSync(
  path.resolve(__dirname, './index.ts.mustache'),
  { encoding: 'utf8' }
)

const params = []

opcodes.forEach((opcode, number) => {
  if (opcode.name === 'BRK') return
  const { name, addr_mode_name } = opcode

  if (addrmodeDefs[addr_mode_name] && opcodeDefs[name]) {
    params.push({
      number: number.toString(16).padStart(2, '0'),
      addressing: addrmodeDefs[addr_mode_name],
      opcode: opcodeDefs[name].code,
      cycles: opcode.cycles - 1
    })
  }
})
mustache.escape = function escape(value) {
  return value
}

console.log(mustache.render(template, { opcodes: params }))
