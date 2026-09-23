import { useEffect, useRef, useState } from 'react';
import Icone from './Icone';
import Marca from './Marca';

export default function Cabecalho({ progressoHero, resultados, aoBuscar, busca, aoComparar, comparando, conta, aoEntrar, aoSair }) {
  const [aberto, setAberto] = useState(false);
  const barra = useRef(null);

  // A barra só entra depois que a palavra terminou de se montar. Aparecer
  // antes seria admitir que a abertura é "outra página".
  const visivel = progressoHero > 0.945;

  useEffect(() => {
    if (!aberto) return;
    const f = (e) => e.key === 'Escape' && setAberto(false);
    addEventListener('keydown', f);
    return () => removeEventListener('keydown', f);
  }, [aberto]);

  return (
    <header className={'topo' + (visivel ? ' vis' : '') + (aberto ? ' aberto' : '')} ref={barra}>
      <div className="topo-dentro">
        <a className="topo-marca" href="#inicio" onClick={() => setAberto(false)}>
          <Marca tam={26} />
          <b>PCD<span>MOTORS</span></b>
        </a>

        <form className="topo-busca" role="search" onSubmit={(e) => e.preventDefault()}>
          <Icone nome="busca" tam={15} />
          <input
            type="search" value={busca} placeholder="Modelo, marca ou cidade"
            aria-label="Buscar veículo adaptado"
            onChange={(e) => aoBuscar(e.target.value)}
          />
          <span className="topo-conta mono">{resultados}</span>
        </form>

        <nav className="topo-nav" aria-label="Principal">
          <a href="#catalogo">Comprar</a>
          <a href="#adaptacoes">Adaptações</a>
          <a href="#isencao">Isenção</a>
        </nav>

        <button type="button" className={'topo-comp' + (comparando ? ' tem' : '')}
                onClick={aoComparar}>
          <Icone nome="balanca" tam={15} />
          Comparar
          {comparando > 0 && <em className="mono">{comparando}</em>}
        </button>

        {conta ? (
          <span className="topo-conta-chip" title={`Entrou como ${conta.nome}`}>
            <i aria-hidden="true">{conta.nome.slice(0, 1).toUpperCase()}</i>
            <span>{conta.nome}</span>
            <button type="button" onClick={aoSair}>sair</button>
          </span>
        ) : (
          <button type="button" className="topo-entrar" onClick={aoEntrar}>Entrar</button>
        )}

        <button type="button" className="topo-menu" aria-expanded={aberto}
                aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
                onClick={() => setAberto((v) => !v)}>
          <Icone nome={aberto ? 'fecha' : 'filtro'} tam={18} />
        </button>
      </div>

      <div className="topo-gaveta" hidden={!aberto}>
        <a href="#catalogo" onClick={() => setAberto(false)}>Comprar</a>
        <a href="#adaptacoes" onClick={() => setAberto(false)}>Adaptações</a>
        <a href="#isencao" onClick={() => setAberto(false)}>Isenção</a>
        {!conta && (
          <button type="button" className="topo-gaveta-entrar"
                  onClick={() => { setAberto(false); aoEntrar(); }}>
            Entrar ou criar conta
          </button>
        )}
      </div>
    </header>
  );
}
