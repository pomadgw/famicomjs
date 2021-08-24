import typescript from '@rollup/plugin-typescript'

export default {
  input: 'src/audio.js',
  output: {
    file: 'audio.esm.js',
    format: 'esm'
  },
  plugins: [typescript()]
}
