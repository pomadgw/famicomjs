const webpack = require('webpack')

module.exports = {
  mount: {
    public: '/',
    src: '/dist',
    wasm: '/wasm'
  },
  plugins: [
    [
      '@snowpack/plugin-build-script',
      { cmd: 'postcss', input: ['.css'], output: ['.css'] }
    ],
    '@snowpack/plugin-babel',
    '@snowpack/plugin-svelte',
    [
      '@snowpack/plugin-run-script',
      {
        cmd: 'svelte-check --output human',
        watch: '$1 --watch',
        output: 'stream'
      }
    ],
    [
      '@snowpack/plugin-run-script',
      {
        cmd: 'yarn asbuild:optimized',
        watch: 'onchange "src/assembly/**/*.ts" -- yarn asbuild:optimized',
        output: 'stream'
      }
    ],
    ['@snowpack/plugin-optimize', {}],
    ...(process.env.USE_WEBPACK
      ? [
          [
            '@snowpack/plugin-webpack',
            {
              extendConfig: (config) => {
                config.plugins.push(
                  new webpack.DefinePlugin({
                    __SNOWPACK_ENV__: JSON.stringify({
                      NODE_ENV: process.env.NODE_ENV
                    })
                  })
                )
                return config
              }
            }
          ]
        ]
      : [])
  ]
}
