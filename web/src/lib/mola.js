// Fisica de mola escrita a mao -- Euler semi-implicito com passo fixo.
//
// Passo fixo importa: com dt vindo direto do rAF, a mesma animacao assenta em
// tempos diferentes em 60Hz e 120Hz, e um frame longo (aba em segundo plano)
// explode a integracao. Aqui o tempo real vira N passos de 1/120s.
const DT = 1 / 120;
const MAX_PASSOS = 12; // ~100ms; alem disso a aba estava parada, nao vale simular

export const PRESETS = {
  layout: { rigidez: 170, atrito: 26, massa: 1 },
  gentil: { rigidez: 120, atrito: 20, massa: 1 },
  firme: { rigidez: 320, atrito: 34, massa: 1 },
  contador: { rigidez: 90, atrito: 20, massa: 1 },
};

export function criar(valor = 0) {
  return { valor, v: 0 };
}

export function avancar(estado, alvo, cfg, decorrido) {
  const { rigidez, atrito, massa } = cfg;
  let passos = Math.min(MAX_PASSOS, Math.round(decorrido / DT));
  if (passos < 1) passos = 1;
  for (let i = 0; i < passos; i++) {
    const forca = -rigidez * (estado.valor - alvo) - atrito * estado.v;
    estado.v += (forca / massa) * DT;
    estado.valor += estado.v * DT;
  }
  return estado;
}

export function parado(estado, alvo, epsilon = 0.4) {
  return Math.abs(estado.valor - alvo) < epsilon && Math.abs(estado.v) < epsilon;
}

// Um unico rAF para a pagina inteira. Cada componente que anima se inscreve
// aqui em vez de abrir o proprio loop -- assim nao ha dez rAF concorrentes
// medindo tempos ligeiramente diferentes.
const inscritos = new Set();
let rodando = false;
let anterior = 0;

function tique(agora) {
  const decorrido = anterior ? (agora - anterior) / 1000 : DT;
  anterior = agora;
  for (const fn of Array.from(inscritos)) fn(Math.min(decorrido, 0.1), agora);
  if (inscritos.size) requestAnimationFrame(tique);
  else { rodando = false; anterior = 0; }
}

export function inscrever(fn) {
  inscritos.add(fn);
  if (!rodando) { rodando = true; requestAnimationFrame(tique); }
  return () => inscritos.delete(fn);
}
