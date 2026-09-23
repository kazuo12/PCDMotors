export const faixa = (v, a, b) => Math.max(0, Math.min(1, (v - a) / (b - a)));
export const suave = (t) => t * t * (3 - 2 * t);
export const preso = (v, a, b) => Math.max(a, Math.min(b, v));

const _moeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency', currency: 'BRL', maximumFractionDigits: 0,
});
export const moeda = (n) => _moeda.format(n);

const _num = new Intl.NumberFormat('pt-BR');
export const numero = (n) => _num.format(n);
export const km = (n) => (n === 0 ? '0 km' : _num.format(n) + ' km');

export const REDUZIDO =
  typeof matchMedia === 'function' &&
  matchMedia('(prefers-reduced-motion: reduce)').matches;
