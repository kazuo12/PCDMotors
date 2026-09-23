// Ponteiro de velocimetro: anel aberto no canto superior direito, ponteiro
// saindo do centro e passando alem do anel, miolo solido por cima. A abertura
// do anel tem 62 graus, centrada na direcao do ponteiro, para o traco teal
// atravessar sem encostar no navy.
//
// Uma so geometria, em viewBox 48 -- o mesmo desenho serve de favicon, de selo
// gigante na abertura e de marca de 18px no topo.
const ARCO = 'M35.72 22.08 A13.5 13.5 0 1 1 24.97 13.24';
const PONTEIRO = 'M23 26.6 L37.92 8.44';

export default function Marca({ tam = 48, duas = true, ...resto }) {
  return (
    <svg viewBox="0 0 48 48" width={tam} height={tam} aria-hidden="true"
         fill="none" strokeWidth="5.6" strokeLinecap="round" {...resto}>
      <path d={ARCO} stroke="currentColor" />
      {/* var() nao funciona em atributo de apresentacao do SVG, so via style.
          `duas=false` deixa tudo em currentColor, para carimbo de uma cor so. */}
      <path d={PONTEIRO}
            stroke={duas ? undefined : 'currentColor'}
            style={duas ? { stroke: 'var(--marca-ponteiro, #0aab8f)' } : undefined} />
      <circle cx="23" cy="26.6" r="4.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

// Marca completa: simbolo + palavra, usada no topo e no rodape.
export function MarcaCompleta({ tam = 26, className = '' }) {
  return (
    <span className={'marca-completa ' + className}>
      <Marca tam={tam} />
      <b>PCD<span>MOTORS</span></b>
    </span>
  );
}
