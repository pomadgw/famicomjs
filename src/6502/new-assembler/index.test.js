import * as assembler from './index'

describe('assembler', () => {
  describe('#assemble', () => {
    it('should assemble correctly', () => {
      expect(
        assembler.assemble(`
        LDA #$01
        STA $0200
        LDA #$05
        STA $0201
        LDA #$08
        STA $0202
      `)
      ).toEqual(
        'a9 01 8d 00 02 a9 05 8d 01 02 a9 08 8d 02 02'
          .split(' ')
          .map((e) => parseInt(e, 16))
      )
    })

    it('should assemble correctly with a branching operator', () => {
      expect(
        assembler.assemble(
          `
        LDX #$08
        decrement:
          DEX
          STX $0200
          CPX #$03
          BNE decrement
          STX $0201
          BRK
      `,
          0x600
        )
      ).toEqual(
        'a2 08 ca 8e 00 02 e0 03 d0 f8 8e 01 02 00'
          .split(' ')
          .map((e) => parseInt(e, 16))
      )
    })
  })
  describe('#compileParam', () => {
    it('should compile $xx to correct format', () => {
      expect(assembler.compileParam('$ff')).toEqual(
        expect.objectContaining({
          params: [0xff]
        })
      )
    })

    it('should compile (empty string) or "A" to correct format', () => {
      expect(assembler.compileParam('')).toEqual(
        expect.objectContaining({
          params: [],
          addressingMode: 'IMP'
        })
      )

      expect(assembler.compileParam('A')).toEqual(
        expect.objectContaining({
          params: [],
          addressingMode: 'IMP'
        })
      )
    })

    it('should compile $xx,X to correct format', () => {
      expect(assembler.compileParam('$ff,X')).toEqual(
        expect.objectContaining({
          params: [0xff],
          addressingMode: 'ZPX'
        })
      )

      expect(assembler.compileParam('$ff,Y')).toEqual(
        expect.objectContaining({
          params: [0xff],
          addressingMode: 'ZPY'
        })
      )
    })

    it('should compile $xx to correct format', () => {
      expect(assembler.compileParam('$ff')).toEqual(
        expect.objectContaining({
          params: [0xff],
          addressingMode: 'ZP0'
        })
      )
    })

    it('should compile #$xx to correct format', () => {
      expect(assembler.compileParam('#$ff')).toEqual(
        expect.objectContaining({
          params: [0xff],
          addressingMode: 'IMM'
        })
      )
    })

    it('should compile #xx to correct format', () => {
      expect(assembler.compileParam('#20')).toEqual(
        expect.objectContaining({
          params: [20],
          addressingMode: 'IMM'
        })
      )
    })

    it('should compile $xxxx to correct format', () => {
      expect(assembler.compileParam('$ff02')).toEqual(
        expect.objectContaining({
          params: [0x02, 0xff],
          addressingMode: 'ABS'
        })
      )
    })

    it('should compile $xxxx,X to correct format', () => {
      expect(assembler.compileParam('$ff02,X')).toEqual(
        expect.objectContaining({
          params: [0x02, 0xff],
          addressingMode: 'ABX'
        })
      )

      expect(assembler.compileParam('$ff02,Y')).toEqual(
        expect.objectContaining({
          params: [0x02, 0xff],
          addressingMode: 'ABY'
        })
      )
    })

    it('should compile ($xxxx) to correct format', () => {
      expect(assembler.compileParam('($ff12)')).toEqual(
        expect.objectContaining({
          params: [0x12, 0xff],
          addressingMode: 'IND'
        })
      )
    })

    it('should compile ($xx,X) to correct format', () => {
      expect(assembler.compileParam('($ff,X)')).toEqual(
        expect.objectContaining({
          params: [0xff],
          addressingMode: 'IZX'
        })
      )
    })

    it('should compile ($xx,X) to correct format', () => {
      expect(assembler.compileParam('($ff),Y')).toEqual(
        expect.objectContaining({
          params: [0xff],
          addressingMode: 'IZY'
        })
      )
    })
  })

  describe('#assembleLine', () => {
    it('should assemble single line correctly', () => {
      expect(assembler.assembleLine('ASL A')).toEqual([0x0a])
      expect(assembler.assembleLine('BRK')).toEqual([0x00])
      expect(assembler.assembleLine('PHP')).toEqual([0x08])
      expect(assembler.assembleLine('LDY #$10')).toEqual([0xa0, 0x10])
      expect(assembler.assembleLine('ASL $10')).toEqual([0x06, 0x10])
      expect(assembler.assembleLine('STA $10,X')).toEqual([0x95, 0x10])
      expect(assembler.assembleLine('STX $10,Y')).toEqual([0x96, 0x10])
      expect(assembler.assembleLine('STA $1000')).toEqual([0x8d, 0x00, 0x10])
      expect(assembler.assembleLine('STA $1000,X')).toEqual([0x9d, 0x00, 0x10])
      expect(assembler.assembleLine('STA $1000,Y')).toEqual([0x99, 0x00, 0x10])
      expect(assembler.assembleLine('JMP ($1000)')).toEqual([0x6c, 0x00, 0x10])
      expect(assembler.assembleLine('ORA ($10,X)')).toEqual([0x01, 0x10])
      expect(assembler.assembleLine('ORA ($10),Y')).toEqual([0x11, 0x10])
      expect(assembler.assembleLine('BEQ $10')).toEqual([0xf0, 0x10])
    })
  })

  describe('#labelLines', () => {
    it('should add line number', () => {
      const lines = `
LDA #$10
STA $1000
      `
        .trim()
        .split('\n')

      expect(assembler.labelLines(lines)).toEqual([
        [0, 'LDA #$10', undefined],
        [2, 'STA $1000', undefined]
      ])
    })

    it('should annotate label correctly', () => {
      const lines = `
LDA #$10
STA $1000
LABEL:
DEX
LABEL2: JMP LABEL
JMP LABEL2
      `
        .trim()
        .split('\n')

      expect(assembler.labelLines(lines)).toEqual([
        [0, 'LDA #$10', undefined],
        [2, 'STA $1000', undefined],
        [5, 'DEX', 'LABEL'],
        [6, 'JMP LABEL', 'LABEL2'],
        [9, 'JMP LABEL2', undefined]
      ])
    })

    it('should throw error message if label is written incorrectly', () => {
      const lines = `
LDA #$10
STA $1000
LABEL:
      `
        .trim()
        .split('\n')

      expect(() => assembler.labelLines(lines)).toThrow(
        'Label without associated instruction'
      )
    })
  })

  describe('#compileLabelToAddress', () => {
    it('should replace label with absolute address', () => {
      expect(
        assembler.compileLabelToAddress([
          [0, 'LDA #$10', undefined],
          [2, 'STA $1000', undefined],
          [5, 'DEC', 'LABEL'],
          [6, 'JMP LABEL', 'LABEL2']
        ])
      ).toEqual([
        [0, 'LDA #$10', undefined],
        [2, 'STA $1000', undefined],
        [5, 'DEC', 'LABEL'],
        [6, 'JMP $0005', 'LABEL2']
      ])
    })

    it('should replace label with relative address', () => {
      expect(
        assembler.compileLabelToAddress([
          [0, 'LDA #$10', undefined],
          [2, 'STA $1000', undefined],
          [5, 'LDA #$10', 'LABEL'],
          [7, 'BEQ LABEL', 'LABEL2']
        ])
      ).toEqual([
        [0, 'LDA #$10', undefined],
        [2, 'STA $1000', undefined],
        [5, 'LDA #$10', 'LABEL'],
        [7, 'BEQ $fc', 'LABEL2']
      ])
    })
  })
})
