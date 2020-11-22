import fromPairs from 'lodash/fromPairs'
import disassemble from '.'
import assemble from '../assembler'

describe('Disassember', () => {
  it('should disassemble a instruction', () => {
    let data = assemble(`
      LDA #$0F
    `)

    let disassembleResult = disassemble(data)
    let slicedDisassembleResult = fromPairs(
      Object.entries(disassembleResult).slice(0, 1)
    )

    expect(slicedDisassembleResult).toEqual(
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
    disassembleResult = disassemble(data)
    slicedDisassembleResult = fromPairs(
      Object.entries(disassembleResult).slice(0, 13)
    )

    expect(slicedDisassembleResult).toEqual(
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
    const disassembleResult = disassemble(data, { binaryStart: 1 })
    const slicedDisassembleResult = fromPairs(
      Object.entries(disassembleResult).slice(0, 6)
    )

    expect(slicedDisassembleResult).toEqual(
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

  it('should show disassembled format based on nintendulator', () => {
    const asmString = `
    LDA #$01
    BRK
    ASL $10
    STA $10,X
    STX $10,Y
    BEQ $FC
    LDA $01,X
    STY $02,X
    LDA $1000
    LDA $1000,X
    LDA $1000,Y
    ASL A
  `
    const lineNumber = asmString.trim().split('\n').length
    const data = assemble(asmString)

    const ram = [0, 0x01, 0x02, 0x03]
    ram[0x10] = 0x00
    ram[0x10 + 1] = 0x1d
    ram[0x10 + 0xc] = 0x1d
    ram[0x1000] = 0x12
    ram[0x1001] = 0x12
    ram[0x100c] = 0x12
    const registers = {
      A: 0x0a,
      X: 1,
      Y: 0x0c,
      SP: 0xf1,
      STATUS: 0x24
    }

    const disassembleResult = disassemble(data, {
      binaryStart: 0x6001,
      nintendulatorFormat: true,
      ram,
      registers
    })
    const slicedDisassembleResult = fromPairs(
      Object.entries(disassembleResult).slice(0, lineNumber)
    )

    expect(slicedDisassembleResult).toEqual({
      $6001: 'LDA #$01',
      $6003: 'BRK',
      $6004: 'ASL $10 = 00',
      $6006: 'STA $10,X @ 11 = 1D',
      $6008: 'STX $10,Y @ 1C = 1D',
      $600A: 'BEQ $6008',
      $600C: 'LDA $01,X @ 02 = 02',
      $600E: 'STY $02,X @ 03 = 03',
      $6010: 'LDA $1000 = 12',
      $6013: 'LDA $1000,X @ 1001 = 12',
      $6016: 'LDA $1000,Y @ 100C = 12',
      $6019: 'ASL A'
    })
  })

  it('should show ?? for imcomplete instrcution', () => {
    expect(disassemble([0xa0])).toEqual(
      expect.objectContaining({
        $0000: 'LDY ??'
      })
    )
  })
})
