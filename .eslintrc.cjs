const react = require('eslint-plugin-react')

module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    '@electron-toolkit/eslint-config-ts/recommended',
    '@electron-toolkit/eslint-config-prettier'
  ],
  settings: { react: { version: '18.3' } },
  plugins: ['eslint-plugin-react-hooks', 'eslint-plugin-react'],
  rules: {
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
    'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx'] }],
    // Prettier specific rules
    'prettier/prettier': [
      'warn', // Ensures Prettier issues are treated as warning | errors
      { endOfLine: 'auto' }
    ]
  }
}
