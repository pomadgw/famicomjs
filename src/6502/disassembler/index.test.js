import disassemble from '.'
import { assemble } from '../assembler'

describe('Disassember', () => {
  it('should disable a instruction', () => {
    let data = assemble(`
      LDA #$0F
    `)

    expect(disassemble(data)).toEqual(['LDA #$0F'])

    data = assemble(`
      LDA #$01
      STA $0200
    `)
    expect(disassemble(data)).toEqual(['LDA #$01', 'STA $0200'])
  })
})
