import parser from './parser'

describe('assembly parser', () => {
  it('should parse correctly', () => {
    const text = `
    .define DATA $ff
    .start $7800
    lda test
    lda test,x
    lda test,y
    lda (test,x)
    lda (test),y
    jmp (test)
    lda $ff
    lda $ffff
    lda $ff,x
    lda $ff,y
    lda $ffff,x
    lda $ffff,y
    lda ($ff,x)
    lda ($ff),y
    lda #$ff
    lda #%0100
    lda #58
    asl a
    jmp ($ffff)
    label:
    beq label
    .reset $7800
    .nmi $7800
    .irq $7800
    .data $0300 20 20 ff 33
    .data $0400 "Hello, world"
    `.trim()

    const expected = [
      {
        varName: 'DATA',
        value: {
          mode: 'ZP0',
          value: [255]
        }
      },
      {
        pc: [0, 120]
      },
      {
        opcode: 'lda',
        params: {
          label: 'test'
        }
      },
      {
        opcode: 'lda',
        params: {
          label: 'test',
          offsetRegister: 'x'
        }
      },
      {
        opcode: 'lda',
        params: {
          label: 'test',
          offsetRegister: 'y'
        }
      },
      {
        opcode: 'lda',
        params: {
          label: 'test',
          mode: 'IZX'
        }
      },
      {
        opcode: 'lda',
        params: {
          label: 'test',
          mode: 'IZY'
        }
      },
      {
        opcode: 'jmp',
        params: {
          label: 'test',
          mode: 'IND'
        }
      },
      {
        opcode: 'lda',
        params: {
          mode: 'ZP0',
          value: [255]
        }
      },
      {
        opcode: 'lda',
        params: {
          mode: 'ABS',
          value: [255, 255]
        }
      },
      {
        opcode: 'lda',
        params: {
          mode: 'ZP0',
          value: [255],
          offsetRegister: 'x'
        }
      },
      {
        opcode: 'lda',
        params: {
          mode: 'ZP0',
          value: [255],
          offsetRegister: 'y'
        }
      },
      {
        opcode: 'lda',
        params: {
          mode: 'ABS',
          value: [255, 255],
          offsetRegister: 'x'
        }
      },
      {
        opcode: 'lda',
        params: {
          mode: 'ABS',
          value: [255, 255],
          offsetRegister: 'y'
        }
      },
      {
        opcode: 'lda',
        params: {
          mode: 'IZX',
          value: [255]
        }
      },
      {
        opcode: 'lda',
        params: {
          mode: 'IZY',
          value: [255]
        }
      },
      {
        opcode: 'lda',
        params: {
          mode: 'IMM',
          value: [255]
        }
      },
      {
        opcode: 'lda',
        params: {
          mode: 'IMM',
          value: [4]
        }
      },
      {
        opcode: 'lda',
        params: {
          mode: 'IMM',
          value: [58]
        }
      },
      {
        opcode: 'asl',
        params: {
          label: 'a'
        }
      },
      {
        opcode: 'jmp',
        params: {
          mode: 'IND',
          value: [255, 255]
        }
      },
      {
        label: 'label'
      },
      {
        opcode: 'beq',
        params: {
          label: 'label'
        }
      },
      {
        reset: [0, 120]
      },
      {
        nmi: [0, 120]
      },
      {
        irq: [0, 120]
      },
      {
        data: [32, 32, 255, 51],
        address: 768
      },
      {
        data: [72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100],
        address: 1024
      }
    ]

    expect(parser.parse(text)).toEqual(expected)
  })
})
