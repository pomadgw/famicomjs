import compile from '.'

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
      `).slice(0, 15)
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
        .start $0600
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
        .data $3000 00 01
        .start $0600
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

    it('should assemble data correctly', () => {
      expect(
        compile(
          `
        .data $3000 0f 01
        .start $0600
        LDX #$08
        DEX
        STX $0200
        CPX #$03
        BNE decrement
        decrement: STX $0201
        BRK
      `
        ).slice(0x3000, 0x3000 + 2)
      ).toEqual([15, 1])
    })

    it('should set interrupt correctly', () => {
      const image = compile(
        `
      .start $0600
      LDX #$08
      DEX
      STX $0200
      CPX #$03
      BNE decrement
      decrement: STX $0201
      BRK
      .reset $0600
      .nmi $0602
      .irq $0604
    `
      )
      expect(image.slice(0xfffc, 0xfffc + 2)).toEqual([0x00, 0x06])
      expect(image.slice(0xfffa, 0xfffa + 2)).toEqual([0x02, 0x06])
      expect(image.slice(0xfffe, 0xfffe + 2)).toEqual([0x04, 0x06])
    })

    it('should remove comment correctly', () => {
      expect(
        compile(`
        ; Ignore This
        // Also This
        LDA #$01 ; Also This
        STA $0200 // Also this
        LDA #$05
        STA $0201
        LDA #$08
        STA $0202
      `).slice(0, 15)
      ).toEqual(
        'a9 01 8d 00 02 a9 05 8d 01 02 a9 08 8d 02 02'
          .split(' ')
          .map((e) => parseInt(e, 16))
      )
    })
  })
})
