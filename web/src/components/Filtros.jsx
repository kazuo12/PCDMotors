import { ADAPTACOES, ORDEM_ADAPTACOES } from '../data/adaptacoes';
import { CARROCERIAS, LIMITES } from '../data/veiculos';
import { moeda } from '../lib/util';
import Icone from './Icone';

function Grupo({ titulo, children, nota }) {
  return (
    <fieldset className="fg">
      <legend>{titulo}</legend>
      {nota && <p className="fg-nota">{nota}</p>}
      {children}
    </fieldset>
  );
}

export default function Filtros({ f, set, limpar, contagens, total }) {
  const alternar = (chave, valor) =>
    set((v) => {
      const lista = v[chave];
      return {
        ...v,
        [chave]: lista.includes(valor) ? lista.filter((x) => x !== valor) : [...lista, valor],
      };
    });

  const sujo =
    f.carrocerias.length || f.adaptacoes.length || f.preco < LIMITES.precoMax ||
    f.somenteLaudo || f.somenteIsencaoTotal;

  return (
    <aside className="trilho" aria-label="Filtros">
      <div className="trilho-topo">
        <h3>Filtrar</h3>
        {sujo ? (
          <button type="button" className="trilho-limpa" onClick={limpar}>
            <Icone nome="fecha" tam={11} /> limpar
          </button>
        ) : (
          <span className="trilho-total mono">{total} no total</span>
        )}
      </div>

      <Grupo titulo="Adaptação necessária"
             nota="O filtro que um classificado comum não tem. Marque o que você precisa dirigir.">
        <ul className="fg-lista">
          {ORDEM_ADAPTACOES.map((cod) => {
            const n = contagens.adaptacoes[cod] || 0;
            const marcado = f.adaptacoes.includes(cod);
            return (
              <li key={cod}>
                <label className={'op' + (marcado ? ' on' : '') + (n ? '' : ' zero')}>
                  <input type="checkbox" checked={marcado} disabled={!n && !marcado}
                         onChange={() => alternar('adaptacoes', cod)} />
                  <span className="op-caixa" aria-hidden="true"><Icone nome="check" tam={11} /></span>
                  <span className="op-nome" title={ADAPTACOES[cod].texto}>{ADAPTACOES[cod].nome}</span>
                  <span className="op-n mono">{n}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </Grupo>

      <Grupo titulo="Carroceria">
        <div className="fg-fichas">
          {CARROCERIAS.map((c) => (
            <button key={c} type="button"
                    className={'ficha' + (f.carrocerias.includes(c) ? ' on' : '')}
                    aria-pressed={f.carrocerias.includes(c)}
                    onClick={() => alternar('carrocerias', c)}>
              {c}
              <em className="mono">{contagens.carrocerias[c] || 0}</em>
            </button>
          ))}
        </div>
      </Grupo>

      <Grupo titulo="Preço até">
        <output className="fg-valor mono">{moeda(f.preco)}</output>
        <input className="fg-range" type="range"
               min={LIMITES.precoMin} max={LIMITES.precoMax} step={2500}
               value={f.preco} aria-label="Preço máximo"
               onChange={(e) => set((v) => ({ ...v, preco: +e.target.value }))} />
        <div className="fg-extremos mono">
          <span>{moeda(LIMITES.precoMin)}</span>
          <span>{moeda(LIMITES.precoMax)}</span>
        </div>
      </Grupo>

      <Grupo titulo="Documentação">
        <ul className="fg-lista">
          <li>
            <label className={'op' + (f.somenteLaudo ? ' on' : '')}>
              <input type="checkbox" checked={f.somenteLaudo}
                     onChange={() => set((v) => ({ ...v, somenteLaudo: !v.somenteLaudo }))} />
              <span className="op-caixa" aria-hidden="true"><Icone nome="check" tam={11} /></span>
              <span className="op-nome">Laudo da adaptação em dia</span>
            </label>
          </li>
          <li>
            <label className={'op' + (f.somenteIsencaoTotal ? ' on' : '')}>
              <input type="checkbox" checked={f.somenteIsencaoTotal}
                     onChange={() => set((v) => ({ ...v, somenteIsencaoTotal: !v.somenteIsencaoTotal }))} />
              <span className="op-caixa" aria-hidden="true"><Icone nome="check" tam={11} /></span>
              <span className="op-nome">Isenção de IPI, ICMS e IPVA</span>
            </label>
          </li>
        </ul>
      </Grupo>
    </aside>
  );
}
