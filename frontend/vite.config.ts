import { sveltekit } from '@sveltejs/kit/vite';
import { paraglide } from '@inlang/paraglide-sveltekit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    paraglide({ project: './project.inlang', outdir: './src/lib/paraglide' }),
    tailwindcss(),
    sveltekit(),
  ],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/lib/**/*.ts'],
      exclude: ['src/**/*.{test,spec}.{js,ts}'],
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  },
});
