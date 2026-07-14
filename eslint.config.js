import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

// Uppercase-named vars/args (components, constants, destructured JSX tags like
// `Icon`) are intentionally exempt; caught errors prefixed with `_` are too.
const noUnusedVars = ['error', {
  varsIgnorePattern: '^[A-Z_]',
  argsIgnorePattern: '^[A-Z_]',
  caughtErrorsIgnorePattern: '^_',
}]

export default defineConfig([
  globalIgnores(['dist']),

  // Browser React app
  {
    files: ['src/**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': noUnusedVars,
      // React Compiler adoption rule; this project doesn't use the compiler, so
      // keep its "manual memoization can't be preserved" advice a warning, not a
      // build-breaking error (it fires on pre-existing, working memoization).
      'react-hooks/preserve-manual-memoization': 'warn',
    },
  },

  // Node context: serverless functions and the Vite config. These use
  // process/Buffer/__dirname/module etc. — declare Node globals so they aren't
  // flagged as undefined.
  {
    files: ['netlify/**/*.{js,mjs}', '*.config.{js,mjs}'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.node,
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': noUnusedVars,
    },
  },

  // Build scripts run under Node, but prerender.mjs executes code inside a real
  // browser via Playwright's page.evaluate(), so allow browser globals too.
  {
    files: ['scripts/**/*.{js,mjs}'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: { ...globals.node, ...globals.browser },
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': noUnusedVars,
    },
  },
])
