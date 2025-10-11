import { defineConfig, loadEnv } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { sveltePreprocess } from 'svelte-preprocess';
import path from 'path';

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [
      svelte({
        preprocess: sveltePreprocess({
          scss: {
            includePaths: ['src'],
          },
        }),
        compilerOptions: {
          dev: process.env.NODE_ENV !== 'production',
        },
        hmr: true,
      }),
    ],
    resolve: {
      alias: {
        '@lib': path.resolve(__dirname, '/src/lib'),
        '@components': path.resolve(__dirname, '/src/components'),
        '@services': path.resolve(__dirname, '/src/services'),
        '@stores': path.resolve(__dirname, '/src/stores'),
      },
    },

    server: {
      port: 5000,
      host: true,
      cors: true,
    },

    build: {
      outDir: 'dist',
      sourcemap: true,
      minify: 'terser',
    },

    optimizeDeps: {
      include: ['svelte-router-spa'],
    },
  });
};
