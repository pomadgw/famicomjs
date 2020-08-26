import * as assembler from './index'

describe('assembler', () => {
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
})
