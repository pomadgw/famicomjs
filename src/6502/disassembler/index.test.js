import disassemble from '.'
import { assemble } from '../assembler'

describe('Disassember', () => {
  it('should disassemble a instruction', () => {
    let data = assemble(`
      LDA #$0F
    `)

    expect(disassemble(data)).toEqual(['LDA #$0F'])

    data = assemble(`
      LDA #$01
      STA $0200
    `)
    expect(disassemble(data)).toEqual(['LDA #$01', 'STA $0200'])

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

    expect(disassemble(data)).toEqual([
      'LDA #$01',
      'BRK',
      'ASL $10',
      'STA $10,X',
      'STX $10,Y',
      'STA $0200',
      'STA $0200,X',
      'STA $0200,Y',
      'ASL A',
      'JMP ($1000)',
      'ORA ($10,X)',
      'ORA ($10),Y',
      'BEQ $10'
    ])
  })

  it('should show target address for branching/jump function', () => {
    const data = assemble(`
      LDA #$01
      BRK
      ASL $10
      STA $10,X
      STX $10,Y
      BEQ $FF
    `)

    expect(disassemble(data, { binaryStart: 1 })).toEqual([
      'LDA #$01', // 1, 2
      'BRK', // 3
      'ASL $10', // 4, 5
      'STA $10,X', // 6, 7
      'STX $10,Y', // 8, 9
      'BEQ $FF // [$0009]' // A
    ])
  })
})
