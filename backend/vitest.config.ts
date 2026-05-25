import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode ?? 'test', '..', '');
  return {
    test: {
      include: ['src/**/*.{test,spec}.ts'],
      environment: 'node',
      env,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'lcov'],
        include: ['src/**/*.ts'],
        exclude: ['src/**/*.{test,spec}.ts', 'src/index.ts'],
      },
    },
  };
});
