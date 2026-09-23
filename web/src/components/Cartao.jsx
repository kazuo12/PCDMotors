import { memo } from 'react';
import { ADAPTACOES } from '../data/adaptacoes';
import { MARCAS } from '../data/marcas';
import { km, moeda } from '../lib/util';
import Icone from './Icone';

// memo() importa aqui: a cada tecla na busca o App re-renderiza, e sem isso os
// 12 cartoes remontariam junto -- o FLIP mede elementos que acabaram de nascer
// e a reordenacao sai errada.
function Cartao({ v, registrar, aoAbrir, aoComparar, comparado, destacado }) {
  return (
    <article ref={registrar} className={'cartao' + (comparado ? ' comp' : '')}>
      <button type="button" className="cartao-foto" onClick={() => aoAbrir(v)}
              aria-label={`Ver ${v.marca} ${v.modelo}`}>
        <img src={v.foto} alt={`${v.modelo} ${v.versao}, ${v.cor}`}
             width="840" height="525" loading="lazy" decoding="async" />
        <span className="cartao-marca">
          <img src={MARCAS[v.marca]} alt="" width="22" height="22" />
        </span>
        {!v.laudo && (
          <span className="cartao-aviso">
            <Icone nome="escudo" tam={12} /> laudo vencido
          </span>
        )}
      </button>

      <div className="cartao-corpo">
        <header className="cartao-cab">
          <h3>
            {v.modelo}
            <span>{v.versao}</span>
          </h3>
          <p className="cartao-preco mono">{moeda(v.preco)}</p>
        </header>

        <p className="cartao-linha mono">
          {v.anoFab}/{v.ano} &middot; {km(v.km)} &middot; {v.carroceria}
        </p>

        {/* As adaptacoes vem antes de qualquer outra coisa: e o dado que faz
            a pessoa parar no anuncio ou seguir rolando. */}
        <ul className="cartao-adap">
          {v.adaptacoes.map((a) => (
            <li key={a} className={destacado.includes(a) ? 'hit' : ''}>
              {ADAPTACOES[a].curto}
            </li>
          ))}
        </ul>

        <footer className="cartao-pe">
          <span className="cartao-local">
            <Icone nome="pino" tam={12} /> {v.cidade}/{v.uf}
          </span>
          <span className="cartao-nota mono">
            <Icone nome="estrela" tam={12} /> {v.nota.toFixed(1)}
          </span>
          <button type="button"
                  className={'cartao-comp' + (comparado ? ' on' : '')}
                  aria-pressed={comparado}
                  onClick={() => aoComparar(v.id)}>
            <Icone nome={comparado ? 'check' : 'balanca'} tam={13} />
            <span className="oculto-visual">Comparar {v.modelo}</span>
          </button>
        </footer>
      </div>
    </article>
  );
}

export default memo(Cartao);
