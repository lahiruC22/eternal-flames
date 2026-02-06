import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // TypeScript strict rules
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],
      
      '@typescript-eslint/no-explicit-any': 'error',
      
      '@typescript-eslint/consistent-type-imports': ['error', {
        prefer: 'type-imports',
        fixStyle: 'separate-type-imports',
      }],
      
      // Async/Promise rules (type-aware rules disabled for performance)
      // To enable, add parserOptions.project: './tsconfig.json'
      // '@typescript-eslint/require-await': 'error',
      // '@typescript-eslint/no-floating-promises': 'error',
      // '@typescript-eslint/await-thenable': 'error',
      
      // React best practices
      'react-hooks/exhaustive-deps': 'warn',
      'react/jsx-no-bind': ['warn', {
        allowArrowFunctions: true,
      }],
      
      // General code quality
      'no-console': ['warn', {
        allow: ['warn', 'error'],
      }],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  {
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',
      'node_modules/**',
      'next-env.d.ts',
      '*.config.js',
      '*.config.mjs',
      'scripts/**',
    ],
  },
]);

export default eslintConfig;