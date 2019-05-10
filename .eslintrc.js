module.exports = {
  root: true,

  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.json',
  },

  env: {
    browser: true,
    node: true,
  },

  globals: {},

  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],

  settings: {
    react: {
      pragma: 'React',
      version: 'detect',
    },
  },

  plugins: ['react', 'react-hooks'],

  rules: {
    // base
    'no-magic-numbers': 'warn',
    indent: ['error', 2],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    'comma-dangle': ['error', 'always-multiline'],
    'eol-last': ['error', 'always'],
    'jsx-quotes': ['error', 'prefer-double'],

    // typescript
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'none',
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      },
    ],
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-explicit-any': 'off',

    // react
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
}
