/* eslint-disable camelcase */
/**
 * This script generates opcode tables
 */
const fs = require('fs')
const opcodes = require('./src/6502/instructions/opcodes.json')

const implementedOpcodes = `
ADC	AND	ASL	BCC	BCS	BEQ	BIT	BMI	BNE	BPL	BRK	BVC	BVS	CLC
CLD	CLI	CLV	CMP	CPX	CPY	DEC	DEX	DEY	EOR	INC	INX	INY	JMP
JSR	LDA	LDX	LDY	LSR	NOP	ORA	PHA	PHP	PLA	PLP	ROL	ROR	RTI
RTS	SBC	SEC	SED	SEI	STA	STX	STY	TAX	TAY	TSX	TXA	TXS	TYA
`
  .trim()
  .split(/(\s|\n)+/)

const bigString = `import CPU from './index'

export default function execute(cpu: CPU, opcode: u8): void {
  switch (opcode) {
  ${opcodes
    .map((opcode, idx) => {
      const isImplemented = implementedOpcodes.includes(
        opcode.name.toUpperCase()
      )
      const caseDecr = `    case 0x${idx.toString(16)}:
      cpu.${opcode.addr_mode.toLowerCase()}Mode()
      cpu.${isImplemented ? opcode.operate.toUpperCase() : 'XXX'}()
      cpu.clocks += ${opcode.cycles}
      break
    `

      return caseDecr
    })
    .join('\n')}

    default:
      break
  }
}
`

fs.writeFileSync('src/assembly/cpu/opcodes.ts', bigString)
