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
    },
  },

  // Node context: serverless functions, build scripts, and Vite config.
  // These use process/Buffer/__dirname/module etc. — declare Node globals so
  // they aren't flagged as undefined, and lint .mjs too.
  {
    files: ['netlify/**/*.{js,mjs}', 'scripts/**/*.{js,mjs}', '*.config.{js,mjs}'],
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
])
