const path = require('path')
const chokidar = require('chokidar')
const { exec } = require('child_process')

const crateDir = path.resolve(__dirname, './nes')
const crateSource = path.resolve(__dirname, './nes')

const watcher = chokidar.watch(`${crateSource}/{neslib,src}/**/*.rs`, {
  ignored: /^\./,
  persistent: true
})

const compileWebm = () => {
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
}

watcher
  .on('add', function (path) {
    console.log('File', path, 'has been added')
    compileWebm()
  })
  .on('change', function (path) {
    console.log('File', path, 'has been changed')
    compileWebm()
  })
  .on('unlink', function (path) {
    console.log('File', path, 'has been removed')
    compileWebm()
  })
  .on('error', function (error) {
    console.error('Error happened', error)
  })
