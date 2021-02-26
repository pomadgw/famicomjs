module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
    jest: true
  },
  extends: [
    'standard',
    'plugin:@typescript-eslint/eslint-recommended',
    // 'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
    parser: '@babel/eslint-parser'
  },
  // plugins: ['@typescript-eslint'],
  // parser: '@typescript-eslint/parser',
  parser: '@babel/eslint-parser',
  rules: {}
}
