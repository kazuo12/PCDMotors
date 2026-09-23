import { useEffect, useRef } from 'react';
import { ADAPTACOES } from '../data/adaptacoes';
import { MARCAS } from '../data/marcas';
import { km, moeda, numero } from '../lib/util';
import Icone from './Icone';

export default function Detalhe({ v, aoFechar }) {
  const painel = useRef(null);
  const antes = useRef(null);

  useEffect(() => {
    if (!v) return;
    antes.current = document.activeElement;
    const trava = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    painel.current?.focus();

    const tecla = (e) => {
      if (e.key === 'Escape') { aoFechar(); return; }
      if (e.key !== 'Tab') return;
      // Prende o Tab dentro da gaveta: sem isso o foco escapa para os cartoes
      // atras do veu e o teclado se perde.
      const focaveis = painel.current?.querySelectorAll(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
      );
      if (!focaveis?.length) return;
      const pri = focaveis[0], ult = focaveis[focaveis.length - 1];
      if (e.shiftKey && document.activeElement === pri) { e.preventDefault(); ult.focus(); }
      else if (!e.shiftKey && document.activeElement === ult) { e.preventDefault(); pri.focus(); }
    };
    addEventListener('keydown', tecla);
    return () => {
      removeEventListener('keydown', tecla);
      document.body.style.overflow = trava;
      antes.current?.focus?.();
    };
  }, [v, aoFechar]);

  if (!v) return null;
  const parcela = Math.round((v.preco * 0.72) / 48);

  return (
    <div className="gav-fundo" onMouseDown={(e) => e.target === e.currentTarget && aoFechar()}>
      <section className="gav" role="dialog" aria-modal="true" aria-labelledby="gav-t"
               tabIndex={-1} ref={painel}>
        <button type="button" className="gav-x" onClick={aoFechar} aria-label="Fechar">
          <Icone nome="fecha" tam={16} />
        </button>

        <figure className="gav-foto">
          <img src={v.foto} alt={`${v.modelo} ${v.versao}`} width="840" height="525" />
          <figcaption className="mono">foto ilustrativa</figcaption>
        </figure>

        <div className="gav-corpo">
          <header className="gav-cab">
            <img className="gav-marca" src={MARCAS[v.marca]} alt="" width="30" height="30" />
            <div>
              <h2 id="gav-t">{v.modelo}</h2>
              <p className="gav-versao mono">{v.versao} &middot; {v.anoFab}/{v.ano} &middot; {v.cor}</p>
            </div>
          </header>

          <p className="gav-destaque">{v.destaque}</p>

          <div className="gav-preco">
            <strong className="mono">{moeda(v.preco)}</strong>
            <span>ou 48x de <b className="mono">{moeda(parcela)}</b> com 28% de entrada</span>
          </div>

          <dl className="gav-fichas">
            <div><dt>Rodados</dt><dd className="mono">{km(v.km)}</dd></div>
            <div><dt>Câmbio</dt><dd>{v.cambio}</dd></div>
            <div><dt>Combustível</dt><dd>{v.combustivel}</dd></div>
            <div><dt>Carroceria</dt><dd>{v.carroceria}</dd></div>
            <div><dt>Garantia</dt><dd>{v.garantia}</dd></div>
            <div><dt>Vendedor</dt><dd>{v.vendedor}</dd></div>
          </dl>

          <h3 className="gav-sub">O que está adaptado</h3>
          <ul className="gav-adap">
            {v.adaptacoes.map((a) => (
              <li key={a}>
                <strong>{ADAPTACOES[a].nome}</strong>
                <p>{ADAPTACOES[a].texto}</p>
              </li>
            ))}
          </ul>

          <h3 className="gav-sub">Isenções deste anúncio</h3>
          <ul className="gav-isen">
            {['IPI', 'ICMS', 'IPVA'].map((t) => {
              const tem = v.isencoes.includes(t);
              return (
                <li key={t} className={tem ? 'sim' : 'nao'}>
                  <Icone nome={tem ? 'check' : 'fecha'} tam={12} /> {t}
                </li>
              );
            })}
          </ul>
          <p className={'gav-laudo' + (v.laudo ? '' : ' alerta')}>
            <Icone nome="escudo" tam={13} />
            {v.laudo
              ? 'Laudo da adaptação conferido e dentro da validade.'
              : 'Laudo da adaptação vencido. Exige revalidação no Detran antes da transferência.'}
          </p>

          <div className="gav-acoes">
            <button type="button" className="bt bt-cheio">Falar com o vendedor</button>
            <button type="button" className="bt bt-vazio">Agendar avaliação</button>
          </div>
          <p className="gav-rodape mono">
            Anúncio de demonstração &middot; {numero(v.preco)} BRL &middot; {v.cidade}/{v.uf}
          </p>
        </div>
      </section>
    </div>
  );
}
