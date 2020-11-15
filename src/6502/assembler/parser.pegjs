{
  function word(low, high) {
    return (high << 8) | low
  }
}

Lines "lines"
	= a:LineWithNewline b:LineWithNewline*  { return [a, ...b].filter(e => e !== '') }

LineWithNewline
	= _ line:Line _N { return line }

Line "line"
	= LabelDeclaration / Program / ProgramCounter / DataLine / ResetInterrupt / NMIInterrupt / IRQInterrupt / Variable

Variable
	= ".define" _ varName:Label _ value:Value {
    	return { varName: varName.label , value }
    }

Value
	= Address / ImmediateValue

DataLine "dataline"
	= ".data"i _ address:AbsoluteAddress _ data:DataLineParams { return { data, address: word(...address.value) } }

DataLineParams
	= data:Array { return data }
      / StringLiteral

Array
	= a:OneByteHex b:(_ OneByteHex)* { return [a[0], ...b.map(e => e[1][0])] }

ProgramCounter "start"
	= ".start"i _ address:AbsoluteAddress { return { pc: address.value } }

ResetInterrupt
	= '.reset' _ address:AbsoluteAddress  { return { reset: address.value } }

IRQInterrupt
	= '.irq' _ address:AbsoluteAddress  { return { irq: address.value } }

NMIInterrupt
	= '.nmi' _ address:AbsoluteAddress  { return { nmi: address.value } }

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
	= IndexedIndirect / IndirectIndexed / AddressWithOffset / AddressLiteral / ImmediateValue / Indirect / Implicit / Label

AddressLiteral
	= AbsoluteAddressLiteral / ZeroPageAddressLiteral

AbsoluteAddressLiteral
	= AbsoluteAddress / VariableDeclaration

ZeroPageAddressLiteral
	= ZeroPageAddress / VariableDeclaration

VariableDeclaration
  = label:Label { return label }

Implicit
	= "A"i

Indirect
	= "(" address:AbsoluteAddressLiteral ")" { return { ...address, mode: 'IND' } }

IndexedIndirect "Indexed Indirect"
	= "(" address:ZeroPageAddressLiteral ",X)"i { return { ...address, mode: 'IZX' } }

IndirectIndexed "Indirect Indexed"
	= "(" address:ZeroPageAddressLiteral "),Y"i { return { ...address, mode: 'IZY' } }

Address "address"
	= AbsoluteAddress / ZeroPageAddress

AddressWithOffset
	= address:AddressLiteral "," reg:Registers { return { ...address, offsetRegister: reg } }

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

StringLiteral
  = '"' chars:DoubleStringCharacter* '"' { return chars.map(e => e.charCodeAt(0)); }
  / "'" chars:SingleStringCharacter* "'" { return chars.map(e => e.charCodeAt(0)); }

DoubleStringCharacter
  = !('"' / "\\") char:. { return char; }
  / "\\" sequence:EscapeSequence { return sequence; }

SingleStringCharacter
  = !("'" / "\\") char:. { return char; }
  / "\\" sequence:EscapeSequence { return sequence; }

EscapeSequence
  = "'"
  / '"'
  / "\\"
  / "b"  { return "\b";   }
  / "f"  { return "\f";   }
  / "n"  { return "\n";   }
  / "r"  { return "\r";   }
  / "t"  { return "\t";   }
  / "v"  { return "\x0B"; }

_ "whitespace"
  = [ \t\n\r]*

_S "whitespace"
  = [ \t]+

_N "newline"
  = [\n\r]*