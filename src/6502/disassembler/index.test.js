import disassemble from '.'
import assemble from '../assembler'

describe('Disassember', () => {
  it('should disassemble a instruction', () => {
    let data = assemble(`
      LDA #$0F
    `)

    expect(disassemble(data)).toEqual(
      expect.objectContaining({ $0000: 'LDA #$0F' })
    )

    data = assemble(`
      LDA #$01
      BRK
      ASL $10
      STA $10,X
      STX $10,Y
      STA $0200
      STA $0200,X
      STA $0200,Y
      ASL A
      JMP ($1000)
      ORA ($10,X)
      ORA ($10),Y
      BEQ $10
    `)

    expect(disassemble(data)).toEqual(
      expect.objectContaining({
        $0000: 'LDA #$01',
        $0002: 'BRK',
        $0003: 'ASL $10',
        $0005: 'STA $10,X',
        $0007: 'STX $10,Y',
        $0009: 'STA $0200',
        $000C: 'STA $0200,X',
        $000F: 'STA $0200,Y',
        $0012: 'ASL A',
        $0013: 'JMP ($1000)',
        $0016: 'ORA ($10,X)',
        $0018: 'ORA ($10),Y',
        $001A: 'BEQ $10'
      })
    )
  })

  it('should show target address for branching/jump function', () => {
    const data = assemble(`
      LDA #$01
      BRK
      ASL $10
      STA $10,X
      STX $10,Y
      BEQ $FC
    `)

    expect(disassemble(data, { binaryStart: 1 })).toEqual(
      expect.objectContaining({
        $0001: 'LDA #$01',
        $0003: 'BRK',
        $0004: 'ASL $10',
        $0006: 'STA $10,X',
        $0008: 'STX $10,Y',
        $000A: 'BEQ $FC // [$0008]'
      })
    )
  })

  it('should show ?? for imcomplete instrcution', () => {
    expect(disassemble([0xa0])).toEqual(
      expect.objectContaining({
        $0000: 'LDY ??'
      })
    )
  })
})
