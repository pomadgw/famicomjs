module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
    jest: true
  },
  extends: ['standard', 'plugin:prettier/recommended'],
  plugins: ['svelte3'],
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3'
    }
  ],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
    parser: '@babel/eslint-parser'
  },
  parser: '@babel/eslint-parser',
  rules: {}
}
