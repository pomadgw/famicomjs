const webpack = require('webpack')

module.exports = {
  mount: {
    public: '/',
    src: '/dist',
    worker: '/worker'
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
        cmd: 'rollup --config scripts/build/rollup.worker.config.js',
        watch: '$1 --watch',
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
