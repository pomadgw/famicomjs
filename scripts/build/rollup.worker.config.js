/* eslint-disable camelcase */
import node_resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
// import static_files from 'rollup-plugin-static-files'
import { terser } from 'rollup-plugin-terser'
import babel from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'

const extensions = ['.js', '.jsx', '.ts', '.tsx']

const pluginsFactory = () => {
  let plugins = [
    node_resolve({ extensions }),
    commonjs(),
    babel({ extensions }),
    json()
  ]

  if (process.env.NODE_ENV === 'production') {
    plugins = plugins.concat([
      // static_files({
      //   include: ['./public']
      // }),
      terser()
    ])
  }

  return plugins
}

const config = [
  {
    input: './src/worker.js',
    output: {
      sourcemap: true,
      dir: 'worker',
      format: 'es',
      entryFileNames: '[name].js',
      assetFileNames: '[name][extname]'
    },
    plugins: pluginsFactory()
  },
  {
    input: './src/nes-worker.js',
    output: {
      sourcemap: true,
      dir: 'worker',
      format: 'es',
      entryFileNames: '[name].js',
      assetFileNames: '[name][extname]'
    },
    plugins: pluginsFactory()
  }
]

export default config
