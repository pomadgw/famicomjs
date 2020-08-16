module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true
  },
  extends: ['plugin:prettier/recommended', 'standard'],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module'
  },
  rules: {}
}
