// ---------------------------------------------------------------------------
// FOTOS DOS ANUNCIOS
//
// Duas pastas, nesta ordem de preferencia:
//
//   src/assets/fotos-reais/<id do veiculo>.webp   <- a foto de verdade
//   src/assets/fotos/*.webp                       <- reserva: recortes do
//                                                    video gravado pelo grupo
//
// Para por a foto real de um anuncio: jogue a imagem em web/fotos-entrada/
// com o nome do modelo (ou o id) e rode `npm run fotos`. O script corta no
// formato do cartao e grava na pasta certa; este arquivo acha sozinho.
//
// O encaixe e por NOME, nao por posicao: cada anuncio pede a sua foto pelo
// proprio id. Antes era por indice, e bastava renomear um arquivo para todas
// as fotos trocarem de carro.
// ---------------------------------------------------------------------------
const reais = import.meta.glob('../assets/fotos-reais/*.webp', {
  eager: true, query: '?url', import: 'default',
});
const reserva = import.meta.glob('../assets/fotos/*.webp', {
  eager: true, query: '?url', import: 'default',
});

const porId = Object.fromEntries(
  Object.entries(reais).map(([k, v]) => [k.split('/').pop().replace(/\.webp$/, ''), v]),
);

export const FOTOS = Object.keys(reserva).sort().map((k) => reserva[k]);

/** Foto real do anuncio se existir; senao o recorte de reserva da posicao. */
export function fotoDe(id, indice) {
  return porId[id] ?? FOTOS[indice % FOTOS.length];
}

/** True quando a foto e de verdade -- a ficha avisa "foto ilustrativa" so no
 *  outro caso, porque com foto real o aviso passa a ser mentira. */
export function fotoEhReal(id) {
  return id in porId;
}
