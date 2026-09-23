// Segundo build: tudo num arquivo so, para abrir do disco com dois cliques.
// O build principal (vite.config.js) continua sendo o que vai para o GitHub.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
  build: {
    target: 'es2020',
    outDir: 'dist-unico',
    assetsInlineLimit: 100 * 1024 * 1024,
    cssCodeSplit: false,
    reportCompressedSize: false,
  },
});
