// vite.config.js
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { sveltePreprocess } from 'svelte-preprocess';

export default defineConfig({
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
      hot: true,
    }),
  ],

  resolve: {
    alias: {
      $lib: '/src/lib',
      $components: '/src/components',
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
