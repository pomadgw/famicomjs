const isUsingNode =
  typeof process !== 'undefined' && process.release.name === 'node'

const PRINT = false
// (typeof window !== 'undefined' && window.DEBUG === true) ||
// (isUsingNode && process.env.DEBUG === 'true')

const debugFn = (() => {
  if (isUsingNode) {
    return {
      log: (...args) => process.stdout.write(...args),
      error: (...args) => process.stderr.write(...args)
    }
  } else {
    return {
      log: (...args) => console.log(...args),
      error: (...args) => console.error(...args)
    }
  }
})()

export function debug(text, mode = 'log') {
  if (PRINT) debugFn[mode](text)
}

export const log = (text) => debug(text, 'log')
export const error = (text) => debug(text, 'error')
