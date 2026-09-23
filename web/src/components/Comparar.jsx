import { ADAPTACOES, ORDEM_ADAPTACOES } from '../data/adaptacoes';
import { MARCAS } from '../data/marcas';
import { km, moeda } from '../lib/util';
import Icone from './Icone';

// Comparar e o segundo motivo do site: duas fichas lado a lado mostram que um
// carro tem freio manual e o outro nao. Numa lista de anuncios isso some.
export default function Comparar({ itens, aoTirar, aoLimpar, aberto, aoAlternar }) {
  if (!itens.length) return null;

  const linhas = [
    ['Preço', (v) => moeda(v.preco), true],
    ['Ano', (v) => `${v.anoFab}/${v.ano}`, true],
    ['Rodados', (v) => km(v.km), true],
    ['Carroceria', (v) => v.carroceria, false],
    ['Cidade', (v) => `${v.cidade}/${v.uf}`, false],
    ['Garantia', (v) => v.garantia, false],
  ];

  return (
    <div className={'bandeja' + (aberto ? ' aberta' : '')}>
      <div className="bandeja-barra">
        <button type="button" className="bandeja-puxa" onClick={aoAlternar}
                aria-expanded={aberto}>
          <Icone nome={aberto ? 'seta' : 'cima'} tam={14} />
          Comparar <em className="mono">{itens.length}</em>
        </button>
        <ul className="bandeja-mini">
          {itens.map((v) => (
            <li key={v.id}>
              <img src={v.foto} alt="" width="56" height="35" />
              <span>{v.modelo}</span>
              <button type="button" onClick={() => aoTirar(v.id)}
                      aria-label={`Tirar ${v.modelo} da comparação`}>
                <Icone nome="fecha" tam={10} />
              </button>
            </li>
          ))}
        </ul>
        <button type="button" className="bandeja-limpa" onClick={aoLimpar}>limpar</button>
      </div>

      <div className="bandeja-tabela" hidden={!aberto}>
        <table>
          <caption className="oculto-visual">Comparação entre veículos selecionados</caption>
          <thead>
            <tr>
              <th scope="row" />
              {itens.map((v) => (
                <th key={v.id} scope="col">
                  <img src={MARCAS[v.marca]} alt="" width="20" height="20" />
                  <b>{v.modelo}</b>
                  <span className="mono">{v.versao}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {linhas.map(([rot, fn, num]) => (
              <tr key={rot}>
                <th scope="row">{rot}</th>
                {itens.map((v) => (
                  <td key={v.id} className={num ? 'mono' : ''}>{fn(v)}</td>
                ))}
              </tr>
            ))}
            {ORDEM_ADAPTACOES.map((cod) => (
              <tr key={cod} className="adap">
                <th scope="row" title={ADAPTACOES[cod].texto}>{ADAPTACOES[cod].nome}</th>
                {itens.map((v) => {
                  const tem = v.adaptacoes.includes(cod);
                  return (
                    <td key={v.id} className={tem ? 'sim' : 'nao'}>
                      <Icone nome={tem ? 'check' : 'fecha'} tam={12} />
                      <span className="oculto-visual">{tem ? 'sim' : 'nao'}</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
