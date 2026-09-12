import js from '@eslint/js'
import { globalIgnores } from 'eslint/config'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import pluginOxlint from 'eslint-plugin-oxlint'
import tseslint from 'typescript-eslint'

export default [
  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  js.configs.recommended,

  ...tseslint.configs.recommended,

  ...pluginOxlint.configs['flat/recommended'],

  {
    files: ['**/*.{js,mjs,cjs,ts,mts,tsx}'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
      },
    },

    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },

    rules: {
      quotes: ['warn', 'single', { avoidEscape: true }],

      'no-console': [
        'warn',
        {
          allow: ['info', 'warn', 'error'],
        },
      ],

      'no-shadow': 'error',
      'no-else-return': 'error',
      'no-lonely-if': 'error',
      'no-unneeded-ternary': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-const': 'error',
      'require-await': 'error',

      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          caughtErrors: 'none',
          destructuredArrayIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
        },
      ],
    },
  },

  {
    files: ['**/*.{ts,tsx}'],

    rules: {
      'no-unused-vars': 'off',
    },
  },
]
