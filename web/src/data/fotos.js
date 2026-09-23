// ---------------------------------------------------------------------------
// FOTOS DOS ANUNCIOS -- ponto unico de troca.
//
// Sao 12 recortes do video enviado pelo grupo (um seda branco na terra e um
// SUV branco no asfalto), cada um num instante, enquadramento e tratamento de
// cor diferente. NAO correspondem aos modelos anunciados.
//
// Para publicar de verdade: troque os arquivos de src/assets/fotos/ pelas
// fotos reais, mantendo a ordem dos nomes. Nenhum outro arquivo muda.
// ---------------------------------------------------------------------------
const mapa = import.meta.glob('../assets/fotos/*.webp', {
  eager: true, query: '?url', import: 'default',
});
export const FOTOS = Object.keys(mapa).sort().map((k) => mapa[k]);
