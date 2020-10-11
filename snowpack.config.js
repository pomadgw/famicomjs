module.exports = {
  mount: {
    public: '/',
    src: '/dist'
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
    ['@snowpack/plugin-optimize', {}]
  ]
}
