import stylistic from '@stylistic/eslint-plugin';
import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
  // Base ESLint config
  js.configs.recommended,

  // Stylistic rules
  {
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      '@stylistic/object-curly-spacing': [ 'error', 'always' ],
      '@stylistic/array-bracket-spacing': [ 'error', 'always' ],
      '@stylistic/space-in-parens': [ 'error', 'always' ],
      '@stylistic/space-before-blocks': [ 'error', 'always' ],
      '@stylistic/indent': [ 'error', 2, { SwitchCase: 1 } ],
      '@stylistic/quote-props': [ 'error', 'as-needed' ],
      '@stylistic/switch-colon-spacing': [ 'error', { after: true, before: false } ],
      '@stylistic/template-curly-spacing': [ 'error', 'never' ],
      '@stylistic/quotes': [ 'error', 'single', { allowTemplateLiterals: true } ],
      '@stylistic/comma-dangle': [ 'error', 'always-multiline' ],
    },
  },

  // React configuration
  {
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-vars': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  // General project rules
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      ecmaVersion: 2024,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'warn',
      'no-undef': 'off',
    },
  },

  // Files configuration
  {
    files: [ '**/*.js', '**/*.jsx', '**/*.mjs', '**/*.cjs' ],
  },

  // Ignores
  {
    ignores: [
      '**/*.min.js',
      '**/node_modules/**',
      '**/build/**',
      '**/.git/**',
      '**/.DS_Store',
    ],
  },
];
