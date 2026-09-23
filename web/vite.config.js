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
        // IIFE com tudo num bundle so: menos requisicoes e nenhuma cadeia de
        // import para o navegador resolver antes de pintar.
        //
        // Atencao: o Vite ainda emite <script type="module"> no HTML, entao
        // este build NAO abre direto do disco (file:// bloqueia modulo por
        // CORS). Para isso existe o vite.config.unico.js, que gera um HTML
        // unico -- e e esse que funciona com dois cliques.
        format: 'iife',
        inlineDynamicImports: true,
        entryFileNames: 'app-[hash].js',
        assetFileNames: 'a/[name]-[hash][extname]',
      },
    },
  },
});
