const path = require('path')
const debounce = require('lodash/debounce')
const chokidar = require('chokidar')
const { exec } = require('child_process')

const crateDir = path.resolve(__dirname, './nes')
const crateSource = path.resolve(__dirname, './nes')

const watcher = chokidar.watch(`${crateSource}/{neslib,src}/**/*.rs`, {
  ignored: /^\./,
  persistent: true
})

const compileWebm = () =>
  exec(
    'wasm-pack build --target web',
    { cwd: crateDir },
    function (error, stdout, stderr) {
      if (error) {
        console.log(error.stack)
        console.log('Error code: ' + error.code)
        console.log('Signal received: ' + error.signal)
      }
      console.log(stdout)
      console.log(stderr)
    }
  )

const debouncedCompile = debounce(compileWebm, 100)

if (process.env.NODE_ENV === 'production') {
  const pc = compileWebm()
  pc.on('close', () => {
    console.log('done!')
    process.exit(0)
  })
} else {
  watcher
    .on('add', function (path) {
      console.log('File', path, 'has been added')
      debouncedCompile()
    })
    .on('change', function (path) {
      console.log('File', path, 'has been changed')
      debouncedCompile()
    })
    .on('unlink', function (path) {
      console.log('File', path, 'has been removed')
      debouncedCompile()
    })
    .on('error', function (error) {
      console.error('Error happened', error)
    })
}
