import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'
import globals from 'globals'
import { defineConfig } from 'eslint/config'


export default defineConfig({
  extends: [
    js.configs.recommended,
    tseslint.configs.recommended,
    tseslint.configs.stylistic,
    importPlugin.flatConfigs.recommended,
    importPlugin.flatConfigs.typescript,
    stylistic.configs.customize({
      indent: 2,
      quotes: 'single',
      semi: false,
      quoteProps: 'consistent-as-needed',
      arrowParens: true,
      commaDangle: 'never',
      blockSpacing: true,
      braceStyle: '1tbs'
    })
  ],
  files: ['**/*.ts'],
  languageOptions: {
    globals: globals.node,
    parserOptions: {
      tsconfigRootDir: import.meta.dirname
    }
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json'
      }
    }
  },
  plugins: {
    '@stylistic': stylistic
  },
  rules: {
    // TypeScript
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',

    // Import
    'import/extensions': ['error', 'never', { json: 'always' }],
    'import/newline-after-import': ['warn', { count: 2 }],
    'import/no-relative-packages': 'error',
    'import/no-useless-path-segments': ['error', { noUselessIndex: true }],
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
        pathGroups: [
          {
            pattern: '@/**',
            group: 'internal',
            position: 'after'
          }
        ],
        pathGroupsExcludedImportTypes: ['type']
      }
    ],

    // Stylistic
    '@stylistic/no-multiple-empty-lines': ['error', { max: 2, maxBOF: 0, maxEOF: 1 }]
  }
})
