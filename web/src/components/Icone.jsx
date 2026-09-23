// Icones desenhados na mao, com traco reto e canto vivo, no mesmo peso do
// texto. Biblioteca pronta traria o arredondado generico de sempre.
const CAMINHOS = {
  busca: 'M7 1.6a5.4 5.4 0 1 1 0 10.8A5.4 5.4 0 0 1 7 1.6Zm4.2 9.6 4 4',
  seta: 'M3 6l5 5 5-5',
  cima: 'M3 10l5-5 5 5',
  fecha: 'M3.5 3.5l9 9m0-9l-9 9',
  check: 'M2.5 8.4 6 11.9l7.5-7.8',
  mais: 'M8 2.5v11M2.5 8h11',
  filtro: 'M1.5 3.5h13M4 8h8M6.5 12.5h3',
  balanca: 'M8 2v12M3 5h10M3 5 1 10h4Zm10 0-2 5h4Z',
  pino: 'M8 14.5S13 9.8 13 6.3a5 5 0 0 0-10 0c0 3.5 5 8.2 5 8.2Z',
  estrela: 'M8 1.8l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 11.6l-3.8 2 .7-4.3-3.1-3 4.3-.6Z',
  escudo: 'M8 1.5 14 4v4.5c0 3.4-2.6 5.6-6 6.6-3.4-1-6-3.2-6-6.6V4Z',
  volante: 'M8 1.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13Zm0 4.6a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8ZM1.6 7.2h4.6M9.8 7.2h4.6M8 10v4.5',
  raio: 'M9 1.5 3.5 9H7.5l-.5 5.5L12.5 7H8.5Z',
  estrada: 'M4 1.5 1.5 14.5M12 1.5l2.5 13M8 2v2.4M8 7v2.4M8 12v2.4',
};

export default function Icone({ nome, tam = 16, ...resto }) {
  const d = CAMINHOS[nome];
  if (!d) return null;
  return (
    <svg viewBox="0 0 16 16" width={tam} height={tam} aria-hidden="true"
         fill="none" stroke="currentColor" strokeWidth="1.5"
         strokeLinecap="square" strokeLinejoin="miter" {...resto}>
      <path d={d} />
    </svg>
  );
}
