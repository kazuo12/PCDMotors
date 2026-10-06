import { memo } from 'react';
import { ADAPTACOES } from '../data/adaptacoes';
import { MARCAS } from '../data/marcas';
import { VEICULOS } from '../data/veiculos';
import { moeda } from '../lib/util';
import Icone from './Icone';
import { Sobe } from './Secoes';

// Faixa contínua de anúncios atravessando a página inteira.
//
// Não é enfeite: o argumento do site é que o estoque compatível é pequeno e
// gira. Uma lista parada não diz isso; uma esteira que nunca para, sim. É
// também o que faz a pessoa querer rolar além do manifesto.
const CARROS = [...VEICULOS].sort((a, b) => a.km - b.km).slice(0, 8);

function Ficha({ v }) {
  return (
    <article className="vit-ficha">
      <img className="vit-foto" src={v.foto} alt="" width="840" height="525"
           loading="lazy" decoding="async" />
      <div className="vit-info">
        <span className="vit-nome">
          <img className="vit-marca" src={MARCAS[v.marca]} alt="" width="18" height="18" />
          <b>{v.modelo}</b>
        </span>
        <span className="vit-preco mono">{moeda(v.preco)}</span>
      </div>
      <p className="vit-adap">{ADAPTACOES[v.adaptacoes[1] || v.adaptacoes[0]].curto}</p>
    </article>
  );
}

function Vitrine() {
  return (
    <section className="vitrine" aria-labelledby="vit-t">
      <Sobe tag="p" className="rotulo mono">Movimento</Sobe>
      <div className="vit-cabeca">
        <Sobe tag="h2" atraso={60} id="vit-t">Entraram esta semana</Sobe>
        <Sobe tag="p" atraso={100} className="secao-linha">
          Para quem precisa de uma adaptação específica, o estoque compatível é
          pequeno e gira rápido. Por isso o alerta vale mais que a busca.
        </Sobe>
      </div>

      {/* A lista aparece duas vezes: a animação desloca exatamente metade da
          largura, então a segunda cópia assume no ponto em que a primeira sai
          e a emenda é invisível. aria-hidden na cópia para o leitor de tela
          não ler tudo em dobro. */}
      <div className="vit-trilho">
        <div className="vit-fita">
          <div className="vit-grupo">
            {CARROS.map((v) => <Ficha key={v.id} v={v} />)}
          </div>
          <div className="vit-grupo" aria-hidden="true">
            {CARROS.map((v) => <Ficha key={v.id + '-eco'} v={v} />)}
          </div>
        </div>
      </div>

      <p className="vit-pe">
        <Icone nome="raio" tam={14} />
        Passe o mouse para parar a esteira.
      </p>
    </section>
  );
}

export default memo(Vitrine);
