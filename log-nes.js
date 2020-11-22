require('@babel/register')({
  extensions: ['.js', '.ts'],
  plugins: ['@babel/plugin-transform-modules-commonjs']
})

require('./log-nes.es6.js')
