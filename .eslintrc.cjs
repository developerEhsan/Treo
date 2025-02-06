module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    '@electron-toolkit/eslint-config-ts/recommended',
    '@electron-toolkit/eslint-config-prettier'
  ],
  rules: {
    // Prettier specific rules
    'prettier/prettier': [
      'warn', // Ensures Prettier issues are treated as warning | errors
      { endOfLine: 'auto' }
    ]
  }
}
