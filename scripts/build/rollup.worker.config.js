/* eslint-disable camelcase */
import node_resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import static_files from 'rollup-plugin-static-files'
import { terser } from 'rollup-plugin-terser'
import babel from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'
import svelte from 'rollup-plugin-svelte'

let plugins = [node_resolve(), commonjs(), babel(), json(), svelte()]

if (process.env.NODE_ENV === 'production') {
  plugins = plugins.concat([
    static_files({
      include: ['./public']
    }),
    terser()
  ])
}

console.log(plugins)

const config = {
  input: './src/worker.js',
  output: {
    dir: 'worker',
    format: 'iife',
    entryFileNames: '[name].js',
    assetFileNames: '[name][extname]'
  },
  plugins
}

export default config
