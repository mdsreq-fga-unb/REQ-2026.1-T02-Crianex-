import svelte from 'eslint-plugin-svelte';
import tsParser from '@typescript-eslint/parser';
import svelteParser from 'svelte-eslint-parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: [
      '.svelte-kit/',
      'build/',
      'dist/',
      'node_modules/',
      'src/lib/paraglide/',
      'vitest.config.ts',
    ],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { project: ['./tsconfig.json', './.svelte-kit/tsconfig.json'] },
    },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: { parser: tsParser },
    },
    plugins: { svelte, '@typescript-eslint': tsPlugin },
    rules: {
      ...svelte.configs.recommended.rules,
    },
  },
  {
    files: ['src/lib/components/ui/**/*.{svelte,ts}'],
    rules: {
      'svelte/valid-compile': 'off',
    },
  },
];
