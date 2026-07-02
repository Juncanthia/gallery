import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

const DOMAINS = ['charts', 'data-table', 'document', 'editor', 'media']

function domainIsolationConfigs() {
  return DOMAINS.map((domain) => ({
    files: [`src/_internals/domains/${domain}/**/*.{ts,tsx}`],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: DOMAINS.filter((other) => other !== domain).map((other) => ({
            group: [`@/_internals/domains/${other}`, `@/_internals/domains/${other}/*`],
            message: `Cross-domain import: ${domain} must not import ${other}`,
          })),
        },
      ],
    },
  }))
}

export default defineConfig([
  globalIgnores(['dist', 'references']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // 当前仓库是组件库 + Gallery，不是单纯 Vite 页面应用；组件文件需要导出 types、hooks、compound APIs。
      'react-refresh/only-export-components': 'off',

      // React Compiler 诊断对现有 shadcn/Radix 封装过于激进，先不作为 lint gate。
      'react-hooks/exhaustive-deps': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/incompatible-library': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/static-components': 'off',
      'react-hooks/use-memo': 'off',
    },
  },
  {
    files: ['src/components/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/app', '@/app/*'],
              message: 'Components must not import from the Gallery app layer (@/app/*)',
            },
          ],
        },
      ],
    },
  },
  ...domainIsolationConfigs(),
  {
    files: ['src/kit/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/_internals/domains/*', '@/_internals/domains/*/**'],
              message: 'kit must not import domains directly; use foundations or components',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/app/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'warn',
        {
          patterns: [
            {
              group: ['@/_internals/domains/*', '@/_internals/domains/*/**'],
              message: 'Prefer @/kit/* over _internals/domains in app code',
            },
          ],
        },
      ],
    },
  },
])
