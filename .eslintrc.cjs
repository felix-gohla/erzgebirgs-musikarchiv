module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: [
    'react-refresh',
    'simple-import-sort',
  ],
  settings: {
    'import/resolver': {
      'node': {
        'extensions': ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  rules: {
    'react-refresh/only-export-components': 'warn',
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'no-trailing-spaces': 'error',
    quotes: ['error', 'single'],
    'no-console': 'warn',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { vars: 'all', args: 'after-used', ignoreRestSiblings: false },
    ],
    'no-empty': 'warn',
    'semi': ['error', 'always'],
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'comma-dangle': ['error', 'always-multiline'],
  },
};
