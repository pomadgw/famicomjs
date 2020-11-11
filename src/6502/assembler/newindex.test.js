import compile from './newindex'

describe('new assembler', () => {
  describe('#compile', () => {
    it('should assemble correctly', () => {
      expect(
        compile(`
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
        compile(
          `
        .pc $0600
        LDX #$08
        decrement:
          DEX
          STX $0200
          CPX #$03
          BNE decrement
          STX $0201
          BRK
      `
        ).slice(0x0600, 0x0600 + 14)
      ).toEqual(
        'a2 08 ca 8e 00 02 e0 03 d0 f8 8e 01 02 00'
          .split(' ')
          .map((e) => parseInt(e, 16))
      )
    })

    it('should assemble correctly with a branching operator', () => {
      expect(
        compile(
          `
        .pc $0600
        LDX #$08
        DEX
        STX $0200
        CPX #$03
        BNE decrement
        decrement: STX $0201
        BRK
      `
        ).slice(0x0600, 0x0600 + 14)
      ).toEqual(
        'a2 08 ca 8e 00 02 e0 03 d0 00 8e 01 02 00'
          .split(' ')
          .map((e) => parseInt(e, 16))
      )
    })
  })
})
