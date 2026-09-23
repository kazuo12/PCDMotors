import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Cabecalho from './components/Cabecalho';
import Catalogo from './components/Catalogo';
import Comparar from './components/Comparar';
import Detalhe from './components/Detalhe';
import Entrar from './components/Entrar';
import Filtros from './components/Filtros';
import Hero from './components/Hero';
import Icone from './components/Icone';
import Simulador from './components/Simulador';
import { Adaptacoes, Isencao, Manifesto, Rodape, Sobe } from './components/Secoes';
import { useFlip } from './hooks/useFlip';
import { ADAPTACOES } from './data/adaptacoes';
import { LIMITES, ORDENACOES, VEICULOS } from './data/veiculos';

const VAZIO = {
  busca: '',
  carrocerias: [],
  adaptacoes: [],
  preco: LIMITES.precoMax,
  somenteLaudo: false,
  somenteIsencaoTotal: false,
};

const normal = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export default function App() {
  const [f, setF] = useState(VAZIO);
  const [ordem, setOrdem] = useState('relevancia');
  const [aberto, setAberto] = useState(null);
  const [comparados, setComparados] = useState([]);
  const [bandeja, setBandeja] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [painelFiltro, setPainelFiltro] = useState(false);
  const [entrar, setEntrar] = useState(false);
  const [conta, setConta] = useState(null);
  const [alerta, setAlerta] = useState(false);

  const lista = useMemo(() => {
    const termo = normal(f.busca.trim());
    return VEICULOS.filter((v) => {
      if (v.preco > f.preco) return false;
      if (f.carrocerias.length && !f.carrocerias.includes(v.carroceria)) return false;
      if (f.adaptacoes.length && !f.adaptacoes.every((a) => v.adaptacoes.includes(a))) return false;
      if (f.somenteLaudo && !v.laudo) return false;
      if (f.somenteIsencaoTotal && v.isencoes.length < 3) return false;
      if (termo) {
        const alvo = normal(`${v.marca} ${v.modelo} ${v.versao} ${v.cidade} ${v.carroceria}`);
        if (!alvo.includes(termo)) return false;
      }
      return true;
    }).sort(ORDENACOES.find((o) => o.id === ordem).fn);
  }, [f, ordem]);

  // Contagens sobre o resultado ANTES do proprio grupo de filtro, senao marcar
  // uma adaptacao zeraria o numero de todas as outras e o filtro viraria um
  // beco sem saida.
  const contagens = useMemo(() => {
    const base = VEICULOS.filter((v) => v.preco <= f.preco &&
      (!f.somenteLaudo || v.laudo) &&
      (!f.somenteIsencaoTotal || v.isencoes.length >= 3));
    const adaptacoes = {}, carrocerias = {};
    for (const v of base.filter((v) => !f.carrocerias.length || f.carrocerias.includes(v.carroceria))) {
      for (const a of v.adaptacoes) adaptacoes[a] = (adaptacoes[a] || 0) + 1;
    }
    for (const v of base.filter((v) => !f.adaptacoes.length || f.adaptacoes.every((a) => v.adaptacoes.includes(a)))) {
      carrocerias[v.carroceria] = (carrocerias[v.carroceria] || 0) + 1;
    }
    return { adaptacoes, carrocerias };
  }, [f.preco, f.somenteLaudo, f.somenteIsencaoTotal, f.carrocerias, f.adaptacoes]);

  const chave = lista.map((v) => v.id).join('|');
  const { registrar, medir } = useFlip(chave);

  // Mede a posicao atual ANTES de o React repintar a lista nova, para o "First"
  // do FLIP ficar correto.
  const chaveAnterior = useRef(chave);
  if (chaveAnterior.current !== chave) {
    medir();
    chaveAnterior.current = chave;
  }

  const alternarComparar = useCallback((id) => {
    setComparados((c) => {
      if (c.includes(id)) return c.filter((x) => x !== id);
      if (c.length >= 3) return [...c.slice(1), id];
      return [...c, id];
    });
  }, []);

  const limpar = useCallback(() => setF(VAZIO), []);
  const itensComp = comparados.map((id) => VEICULOS.find((v) => v.id === id)).filter(Boolean);

  useLayoutEffect(() => {
    if (!comparados.length) setBandeja(false);
  }, [comparados.length]);

  // Entrar ja aplica a adaptacao escolhida no cadastro: a conta so vale a pena
  // se mudar alguma coisa na hora, e nao depois de um e-mail de confirmacao.
  const concluirEntrada = useCallback((dados) => {
    setConta(dados);
    setEntrar(false);
    if (dados.adaptacao) {
      setF((v) => ({ ...v, adaptacoes: [dados.adaptacao] }));
      setTimeout(() => {
        document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    }
  }, []);

  const criarAlerta = useCallback(() => {
    if (!conta) { setEntrar(true); return; }
    setAlerta(true);
  }, [conta]);

  const filtrando = !!(f.adaptacoes.length || f.carrocerias.length || f.busca);

  return (
    <>
      <Cabecalho
        progressoHero={progresso}
        resultados={lista.length}
        busca={f.busca}
        aoBuscar={(s) => setF((v) => ({ ...v, busca: s }))}
        comparando={comparados.length}
        aoComparar={() => comparados.length && setBandeja((v) => !v)}
        conta={conta}
        aoEntrar={() => setEntrar(true)}
        aoSair={() => { setConta(null); setAlerta(false); }}
      />

      <Hero aoProgredir={setProgresso} />

      {/* Tudo daqui para baixo divide um fundo so. Nenhum bloco tem cor
          propria -- e por isso que a rolagem parece um movimento unico. */}
      <main className="corpo">
        <div className="espinha" aria-hidden="true" />

        <Manifesto />

        <section className="secao busca" id="catalogo">
          <Sobe tag="p" className="rotulo mono">Catálogo</Sobe>
          <Sobe tag="h2" atraso={60}>Filtre pela adaptação, não pelo modelo</Sobe>

          <button type="button" className="abre-filtro"
                  onClick={() => setPainelFiltro((v) => !v)}
                  aria-expanded={painelFiltro}>
            <Icone nome="filtro" tam={15} />
            Filtrar
            {(f.adaptacoes.length + f.carrocerias.length) > 0 && (
              <em className="mono">{f.adaptacoes.length + f.carrocerias.length}</em>
            )}
          </button>

          <div className={'busca-grade' + (painelFiltro ? ' painel' : '')}>
            <Filtros f={f} set={setF} limpar={limpar}
                     contagens={contagens} total={VEICULOS.length} />
            <div>
              <Catalogo
                lista={lista} ordem={ordem} aoOrdenar={setOrdem}
                registrar={registrar} aoAbrir={setAberto}
                aoComparar={alternarComparar} comparados={comparados}
                destacado={f.adaptacoes} aoLimpar={limpar} filtrando={filtrando}
              />

              {/* O alerta e o coracao do produto: para essa pessoa existem
                  poucos carros compativeis no pais inteiro, entao ser avisado
                  vale mais do que procurar de novo toda semana. */}
              {filtrando && (
                <div className={'alerta-faixa' + (alerta ? ' feito' : '')}>
                  {alerta ? (
                    <p>
                      <Icone nome="check" tam={15} />
                      Pronto, {conta?.nome}. Avisamos você assim que entrar um carro
                      com {f.adaptacoes.map((a) => ADAPTACOES[a].nome.toLowerCase()).join(' e ') || 'esses filtros'}.
                    </p>
                  ) : (
                    <>
                      <p>
                        <Icone nome="raio" tam={15} />
                        Só {lista.length} {lista.length === 1 ? 'carro serve' : 'carros servem'} hoje.
                        Quer ser avisado quando entrar outro?
                      </p>
                      <button type="button" className="bt bt-cheio" onClick={criarAlerta}>
                        {conta ? 'Criar alerta' : 'Entrar e criar alerta'}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        <Adaptacoes />
        <Simulador />
        <Isencao />
      </main>

      <Rodape />

      <Comparar itens={itensComp} aoTirar={alternarComparar}
                aoLimpar={() => setComparados([])}
                aberto={bandeja} aoAlternar={() => setBandeja((v) => !v)} />

      <Detalhe v={aberto} aoFechar={() => setAberto(null)} />

      <Entrar aberto={entrar} aoFechar={() => setEntrar(false)} aoEntrar={concluirEntrada} />
    </>
  );
}
