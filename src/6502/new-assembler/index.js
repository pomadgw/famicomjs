export function compileParam(string) {
  const result = /\(?(#)?(\$?)([\da-f]+)\)?(?:,([xy]))?\)?/.exec(
    string.toLowerCase()
  )

  let params
  let addressingMode = 'IMP'

  if (!result || string.toLowerCase() === 'a') {
    return { params: [], addressingMode }
  }

  const useIndirect = /\(\$[\da-f]+\)/.exec(string.toLowerCase())
  const useInxInd = /\(\$[\da-f]+,x\)/.exec(string.toLowerCase())
  const useIndInx = /\(\$[\da-f]+\),y/.exec(string.toLowerCase())

  const [, isImmediate, isHex, numberString, offsetRegister] = result

  const number = isHex ? parseInt(numberString, 16) : parseInt(numberString, 10)

  const is8bitParam = numberString.length <= 2

  if (isImmediate || is8bitParam) {
    params = [number]
  } else {
    params = [number & 0xff, (number >> 8) & 0xff]
  }

  if (isImmediate) {
    addressingMode = 'IMM'
  } else if (!is8bitParam && useIndirect) {
    addressingMode = 'IND'
  } else if (useInxInd) {
    addressingMode = 'IZX'
  } else if (useIndInx) {
    addressingMode = 'IZY'
  } else if (offsetRegister) {
    addressingMode = is8bitParam
      ? `ZP${offsetRegister.toUpperCase()}`
      : `AB${offsetRegister.toUpperCase()}`
  } else {
    addressingMode = is8bitParam ? 'ZP0' : 'ABS'
  }

  return { params, addressingMode }
}
