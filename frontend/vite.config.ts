import { sveltekit } from '@sveltejs/kit/vite';
import { paraglide } from '@inlang/paraglide-sveltekit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  envDir: '../',
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
    // Pré-transforma o shell admin (layout + hooks + a página mais pesada) na
    // subida do servidor em vez de no primeiro acesso — em `vite dev` o custo
    // de compilar sob demanda um grafo de módulos grande (ícones, componentes
    // do painel) só acontece na primeira requisição, o que somado aos
    // round-trips de autenticação explicava boa parte da demora inicial.
    warmup: {
      clientFiles: [
        './src/routes/(admin)/+layout.svelte',
        './src/routes/(admin)/admin/crm/+page.svelte',
      ],
      ssrFiles: [
        './src/hooks.server.ts',
        './src/routes/(admin)/+layout.server.ts',
        './src/routes/(admin)/admin/crm/+page.server.ts',
      ],
    },
  },
});
