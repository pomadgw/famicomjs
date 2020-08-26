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
})
