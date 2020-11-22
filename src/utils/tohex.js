export default function toHex(number, { length = 2, withPrefix = false } = {}) {
  const prefix = withPrefix ? '$' : ''

  return `${prefix}${number.toString(16).toUpperCase().padStart(length, '0')}`
}

export function toHex4(number, { withPrefix = false } = {}) {
  return toHex(number, { length: 4, withPrefix })
}
