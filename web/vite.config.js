import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Caminhos relativos: o mesmo build serve no GitHub Pages (que fica num
  // subcaminho /repo/) e ao abrir o index.html direto do disco.
  base: './',
  build: {
    target: 'es2020',
    assetsInlineLimit: 0,        // nada de base64: arquivo separado cacheia
    cssCodeSplit: false,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        // IIFE em vez de modulo ES: <script type="module"> e bloqueado por
        // CORS quando a pagina abre via file://, e a ideia e que dar dois
        // cliques no index.html funcione.
        format: 'iife',
        inlineDynamicImports: true,
        entryFileNames: 'app-[hash].js',
        assetFileNames: 'a/[name]-[hash][extname]',
      },
    },
  },
});
