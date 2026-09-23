// Logos do car-logos-dataset (filippofilip95), licenca MIT.
const mapa = import.meta.glob('../assets/marcas/*.webp', {
  eager: true, query: '?url', import: 'default',
});
export const MARCAS = Object.fromEntries(
  Object.entries(mapa).map(([k, v]) => [k.split('/').pop().replace('.webp', ''), v]),
);
