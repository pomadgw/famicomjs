/* eslint-disable camelcase */
import node_resolve from 'rollup-plugin-node-resolve'
import static_files from 'rollup-plugin-static-files'
import { terser } from 'rollup-plugin-terser'
import babel from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'

const config = {
  input: './src/index.js',
  output: {
    dir: 'dist',
    format: 'esm',
    entryFileNames: '[name].[hash].js',
    assetFileNames: '[name].[hash][extname]'
  },
  plugins: [
    babel({
      babelHelpers: 'runtime'
    }),
    node_resolve(),
    json()
  ],
  external: [/@babel\/runtime/]
}

if (process.env.NODE_ENV === 'production') {
  config.plugins = config.plugins.concat([
    static_files({
      include: ['./public']
    }),
    terser()
  ])
}

export default config
