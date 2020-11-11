Lines "lines"
	= a:LineWithNewline b:LineWithNewline*  { return [a, ...b].filter(e => e !== '') }

LineWithNewline
	= _ line:Line _N { return line }

Line "line"
	= LabelDeclaration / Program / ProgramCounter / DataLine

DataLine "dataline"
	= ".data"i _ AbsoluteAddress

ProgramCounter "pc"
	= ".pc"i _ address:AbsoluteAddress { return { pc: address.value } }

Program "program"
	= opcode:Opcode _S? params:Parameters? { return { opcode, params } }

LabelDeclaration "label"
	= label:Label _S? ":" { return label }

Label
	= label:String { return { label } }

Opcode "opcode"
	= "ADC"i /
      "AND"i /
      "ASL"i /
      "BCC"i /
      "BCS"i /
      "BEQ"i /
      "BIT"i /
      "BMI"i /
      "BNE"i /
      "BPL"i /
      "BRK"i /
      "BVC"i /
      "BVS"i /
      "CLC"i /
      "CLD"i /
      "CLI"i /
      "CLV"i /
      "CMP"i /
      "CPX"i /
      "CPY"i /
      "DEC"i /
      "DEX"i /
      "DEY"i /
      "EOR"i /
      "INC"i /
      "INX"i /
      "INY"i /
      "JMP"i /
      "JSR"i /
      "LDA"i /
      "LDX"i /
      "LDY"i /
      "LSR"i /
      "NOP"i /
      "ORA"i /
      "PHA"i /
      "PHP"i /
      "PLA"i /
      "PLP"i /
      "ROL"i /
      "ROR"i /
      "RTI"i /
      "RTS"i /
      "SBC"i /
      "SEC"i /
      "SED"i /
      "SEI"i /
      "STA"i /
      "STX"i /
      "STY"i /
      "TAX"i /
      "TAY"i /
      "TSX"i /
      "TXA"i /
      "TXS"i /
      "TYA"i

Parameters "params"
	= IndexedIndirect / IndirectIndexed / AddressWithOffset / Address / ImmediateValue / Indirect / Implicit / Label

Implicit
	= "A"i

Indirect
	= "(" address:AbsoluteAddress ")" { return { ...address, mode: 'IND' } }

IndexedIndirect "Indexed Indirect"
	= "(" address:ZeroPageAddress ",X)"i { return { ...address, mode: 'IZX' } }

IndirectIndexed "Indirect Indexed"
	= "(" address:ZeroPageAddress "),Y"i { return { ...address, mode: 'IZY' } }

Address "address"
	= AbsoluteAddress / ZeroPageAddress

AddressWithOffset
	= address:Address "," reg:Registers { return { ...address, offsetRegister: reg } }

ZeroPageAddress "ZP0 address"
	= "$" value:OneByteHex { return { mode: 'ZP0', value } }

AbsoluteAddress "absolute address"
	= "$" value:TwoByteHex { return { mode: 'ABS', value } }

RegisterParam
	= "," Registers

Registers
	= "X"i / "Y"i

ImmediateValue "imm"
	= "#" number:Number { return { mode: 'IMM', value: [number] } }

Number "num"
	= Hex / BinaryString / Integer

Hex "Hex"
	= "$" hex:HexType { return hex[0] }

HexType
	= TwoByteHex / OneByteHex

OneByteHex
	= digits:([0-9a-fA-F][0-9a-fA-F]) { return [parseInt(digits.join(''), 16)]; }

TwoByteHex
	= digitHigh:([0-9a-fA-F][0-9a-fA-F]) digitLow:([0-9a-fA-F][0-9a-fA-F]) { return [parseInt(digitLow.join(''), 16), parseInt(digitHigh.join(''), 16)]; }

BinaryString "BinStr"
	= "%" number:Binary { return number }

Binary "bin"
	= digits:([01]+)  {
    	const num = parseInt(digits.join(''), 2);
        if (num > 255) throw new Error('Overflow')
        return num;
      }

Integer "integer"
	= _ [0-9]+ { return parseInt(text(), 10); }

String "string"
	= [a-zA-Z0-9]+ { return text() }

_ "whitespace"
  = [ \t\n\r]*

_S "whitespace"
  = [ \t]+

_N "newline"
  = [\n\r]*
  