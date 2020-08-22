module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
    jest: true
  },
  extends: ['standard', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
    parser: '@babel/eslint-parser'
  },
  parser: '@babel/eslint-parser',
  rules: {}
}
