/* eslint-disable camelcase */
import node_resolve from 'rollup-plugin-node-resolve'
import { getBabelOutputPlugin } from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'

const config = {
  input: './bin/assemble.js',
  output: {
    dir: '_bin',
    format: 'cjs',
    entryFileNames: '[name].js'
  },
  plugins: [
    getBabelOutputPlugin({
      presets: ['@babel/preset-env'],
      plugins: ['@babel/plugin-transform-runtime']
    }),
    commonjs(),
    node_resolve(),
    json()
  ],
  external: [/@babel\/runtime/, 'fs', /yargs/]
}

export default config
