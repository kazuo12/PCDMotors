// Os quadros da abertura sao arquivos .webp de verdade, nao data: URI.
// import.meta.glob faz o Vite emitir cada um com hash e devolver a URL ja
// resolvida contra `base` -- funciona no GitHub Pages, num subcaminho e no
// disco, sem nada codificado a mao.
const mapa = import.meta.glob('../assets/quadros/*.webp', {
  eager: true, query: '?url', import: 'default',
});
export const QUADROS = Object.keys(mapa).sort().map((k) => mapa[k]);
