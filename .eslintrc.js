module.exports = {
  env: {
    browser: true,
    es2020: true,
    jest: true
  },
  extends: [
    'plugin:vue/essential',
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
  plugins: ['vue'],
  // plugins: ['@typescript-eslint'],
  // parser: '@typescript-eslint/parser',
  rules: {}
}
