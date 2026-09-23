import { useEffect, useRef, useState } from 'react';
import { ORDENACOES } from '../data/veiculos';
import { useContagem } from '../hooks/useContagem';
import Cartao from './Cartao';
import Icone from './Icone';

function Ordenar({ valor, aoTrocar }) {
  const [aberto, setAberto] = useState(false);
  const caixa = useRef(null);
  useEffect(() => {
    if (!aberto) return;
    const fora = (e) => !caixa.current?.contains(e.target) && setAberto(false);
    const esc = (e) => e.key === 'Escape' && setAberto(false);
    addEventListener('mousedown', fora);
    addEventListener('keydown', esc);
    return () => { removeEventListener('mousedown', fora); removeEventListener('keydown', esc); };
  }, [aberto]);

  const atual = ORDENACOES.find((o) => o.id === valor);
  return (
    <div className="ordena" ref={caixa}>
      <button type="button" onClick={() => setAberto((v) => !v)} aria-expanded={aberto}
              aria-haspopup="listbox">
        {atual.nome} <Icone nome={aberto ? 'cima' : 'seta'} tam={13} />
      </button>
      <ul className="ordena-menu" role="listbox" hidden={!aberto}>
        {ORDENACOES.map((o) => (
          <li key={o.id} role="option" aria-selected={o.id === valor}>
            <button type="button" onClick={() => { aoTrocar(o.id); setAberto(false); }}>
              {o.id === valor && <Icone nome="check" tam={12} />}
              {o.nome}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Catalogo({
  lista, ordem, aoOrdenar, registrar, aoAbrir, aoComparar, comparados,
  destacado, aoLimpar, filtrando,
}) {
  const n = useContagem(lista.length);

  return (
    <div className="catalogo">
      <div className="catalogo-cab">
        <p className="catalogo-conta">
          <strong className="mono">{Math.round(n)}</strong>
          {lista.length === 1 ? ' veículo encontrado' : ' veículos encontrados'}
        </p>
        <Ordenar valor={ordem} aoTrocar={aoOrdenar} />
      </div>

      {lista.length === 0 ? (
        <div className="vazio">
          <Icone nome="estrada" tam={28} />
          <h3>Nenhum carro com essa combinação</h3>
          <p>
            Tente soltar uma das adaptações marcadas ou subir o teto de preço.
            No catálogo real essa busca vira um alerta por e-mail.
          </p>
          <button type="button" className="bt bt-vazio" onClick={aoLimpar}>
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className={'grade' + (filtrando ? ' filtrando' : '')}>
          {lista.map((v) => (
            <Cartao
              key={v.id} v={v}
              registrar={registrar(v.id)}
              aoAbrir={aoAbrir}
              aoComparar={aoComparar}
              comparado={comparados.includes(v.id)}
              destacado={destacado}
            />
          ))}
        </div>
      )}
    </div>
  );
}
