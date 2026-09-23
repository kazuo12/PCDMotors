import { useState } from 'react';
import { useContagem } from '../hooks/useContagem';
import { moeda } from '../lib/util';
import { VEICULOS } from '../data/veiculos';
import Icone from './Icone';
import { Sobe } from './Secoes';

// Regras de 2024, arredondadas. Os tetos sao o que realmente decide a compra:
// um carro de R$ 125 mil perde a isencao de ICMS inteira por cinco mil reais,
// e ninguem descobre isso numa lista de anuncios comum.
const TETO_IPI = 200000;
const TETO_ICMS = 120000;
const ALIQ = { ipi: 0.0991, icms: 0.12, ipva: 0.04 };

function Linha({ nome, valor, ativo, nota }) {
  const n = useContagem(ativo ? valor : 0);
  return (
    <div className={'sim-linha' + (ativo ? '' : ' fora')}>
      <dt>
        {nome}
        {nota && <span>{nota}</span>}
      </dt>
      <dd className="mono">{ativo ? moeda(Math.round(n)) : '—'}</dd>
    </div>
  );
}

export default function Simulador() {
  const [preco, setPreco] = useState(98000);

  const ipi = preco <= TETO_IPI ? preco * ALIQ.ipi : 0;
  const icms = preco <= TETO_ICMS ? preco * ALIQ.icms : 0;
  const ipva = preco * ALIQ.ipva;
  const avista = ipi + icms;
  const total = useContagem(avista);

  // Quantos anuncios do catalogo cabem em cada teto. E o que liga o simulador
  // ao resto do site em vez de deixar uma calculadora solta na pagina.
  const cabemIcms = VEICULOS.filter((v) => v.preco <= TETO_ICMS).length;

  return (
    <section className="secao sim" id="isencao">
      <Sobe tag="p" className="rotulo mono">Simulador</Sobe>
      <div className="sim-corpo">
        <div>
          <Sobe tag="h2" atraso={60}>Quanto a isenção tira do preço</Sobe>
          <Sobe tag="p" atraso={100} className="secao-linha">
            Arraste até o valor do carro que você está olhando. O teto do ICMS é
            o que mais pega gente de surpresa: passou de {moeda(TETO_ICMS)}, some
            a isenção inteira — não é proporcional.
          </Sobe>

          <Sobe tag="div" atraso={140} className="sim-controle">
            <output className="sim-preco mono">{moeda(preco)}</output>
            <input className="fg-range" type="range" min={50000} max={230000} step={1000}
                   value={preco} aria-label="Preço do veículo"
                   onChange={(e) => setPreco(+e.target.value)} />
            <div className="fg-extremos mono">
              <span>{moeda(50000)}</span>
              <span>{moeda(230000)}</span>
            </div>
            <p className="sim-catalogo">
              <Icone nome="estrela" tam={13} />
              {cabemIcms} dos {VEICULOS.length} anúncios deste catálogo ficam abaixo
              do teto de ICMS.
            </p>
          </Sobe>
        </div>

        <Sobe tag="div" atraso={180} className="sim-painel">
          <dl>
            <Linha nome="IPI" valor={ipi} ativo={preco <= TETO_IPI}
                   nota={preco <= TETO_IPI ? '9,91% · teto R$ 200 mil' : `acima do teto de ${moeda(TETO_IPI)}`} />
            <Linha nome="ICMS" valor={icms} ativo={preco <= TETO_ICMS}
                   nota={preco <= TETO_ICMS ? '12% · teto R$ 120 mil' : `acima do teto de ${moeda(TETO_ICMS)}`} />
          </dl>
          <div className="sim-total">
            <span>Economia na compra</span>
            <strong className="mono">{moeda(Math.round(total))}</strong>
          </div>
          <div className="sim-ipva">
            <span>IPVA isento, por ano</span>
            <b className="mono">{moeda(Math.round(ipva))}</b>
          </div>
          <p className="sim-aviso">
            <Icone nome="escudo" tam={13} />
            Estimativa. Alíquota de ICMS e IPVA muda por estado, e os tetos são
            revistos por lei — confirme no órgão antes de fechar.
          </p>
        </Sobe>
      </div>
    </section>
  );
}
