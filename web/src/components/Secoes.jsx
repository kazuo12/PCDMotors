import { ADAPTACOES, ORDEM_ADAPTACOES } from '../data/adaptacoes';
import { useAoVer } from '../hooks/useAoVer';
import { useContagem } from '../hooks/useContagem';
import { numero } from '../lib/util';
import Icone from './Icone';
import Marca from './Marca';

// Bloco que sobe ao entrar na tela. O deslocamento e pequeno (14px) de
// proposito: o exagero e o que denuncia template.
export function Sobe({ children, atraso = 0, tag: Tag = 'div', ...resto }) {
  const [ref, visto] = useAoVer();
  return (
    <Tag ref={ref} className={'sobe' + (visto ? ' vis' : '')}
         style={{ '--atraso': atraso + 'ms' }} {...resto}>
      {children}
    </Tag>
  );
}

function Numero({ alvo, sufixo = '' }) {
  const [ref, visto] = useAoVer();
  const n = useContagem(visto ? alvo : 0, visto);
  return <strong ref={ref} className="mono">{numero(Math.round(n))}{sufixo}</strong>;
}

export function Manifesto() {
  return (
    <section className="secao manifesto" id="inicio">
      <Sobe tag="p" className="rotulo mono">Projeto Integrador I &middot; Itapetininga SP</Sobe>
      <div className="manifesto-corpo">
      <Sobe tag="h2" atraso={60} className="manifesto-titulo">
        Procurar carro adaptado hoje é procurar duas vezes.
      </Sobe>
      <Sobe tag="div" atraso={120} className="manifesto-texto">
        <p>
          Nos classificados grandes a adaptação não é um campo: é uma frase perdida
          na descrição. Quem depende de acelerador esquerdo abre trinta anúncios
          para descobrir que dois servem.
        </p>
        <p>
          O PCD Motors inverte isso. A adaptação é o primeiro filtro, o laudo e a
          isenção aparecem na ficha, e a comparação mostra lado a lado o que cada
          carro já tem instalado.
        </p>
      </Sobe>
      </div>
      <div className="numeros">
        {[
          ['Veículos adaptados anunciados', 1247, ''],
          ['Instaladores com laudo conferido', 38, ''],
          ['Cidades atendidas na região', 24, ''],
        ].map(([rot, n], i) => (
          <Sobe key={rot} tag="div" atraso={160 + i * 70} className="numero">
            <Numero alvo={n} />
            <span>{rot}</span>
          </Sobe>
        ))}
      </div>
    </section>
  );
}

export function Adaptacoes() {
  return (
    <section className="secao adapt" id="adaptacoes">
      <Sobe tag="p" className="rotulo mono">Glossário</Sobe>
      <Sobe tag="h2" atraso={60}>O que cada adaptação resolve</Sobe>
      <Sobe tag="p" atraso={100} className="secao-linha">
        Comprar adaptado exige vocabulário que ninguém ensina. Estes são os sete
        itens que aparecem nos filtros do site.
      </Sobe>
      <ul className="adapt-grade">
        {ORDEM_ADAPTACOES.map((cod, i) => (
          <Sobe key={cod} tag="li" atraso={60 + i * 45} className="adapt-item">
            <span className="adapt-n mono">{String(i + 1).padStart(2, '0')}</span>
            <h3>{ADAPTACOES[cod].nome}</h3>
            <p>{ADAPTACOES[cod].texto}</p>
          </Sobe>
        ))}
        {/* Oitava celula: fecha a grade e diz o que vale para todas elas. */}
        <Sobe tag="li" atraso={60 + 7 * 45} className="adapt-item adapt-nota">
          <b>Vale para todas</b>
          <p>
            Qualquer uma delas precisa de laudo médico, instalação em oficina
            credenciada e vistoria no Detran para constar no documento do carro.
          </p>
        </Sobe>
      </ul>
    </section>
  );
}

export function Isencao() {
  const passos = [
    ['Laudo médico', 'Perícia do Detran ou médico credenciado define quais comandos você precisa. É o documento que abre tudo o mais.'],
    ['Autorização dos órgãos', 'Receita Federal libera o IPI, a Secretaria da Fazenda libera o ICMS e o Detran registra a condição no CRLV.'],
    ['Escolha do carro', 'Aqui: filtre pela adaptação, confira laudo e isenção na ficha e compare os finalistas lado a lado.'],
    ['Instalação e vistoria', 'A adaptação precisa de oficina credenciada e vistoria. Sem isso o carro não transfere no seu nome.'],
  ];
  return (
    <section className="secao isen" id="caminho">
      <Sobe tag="p" className="rotulo mono">Caminho</Sobe>
      <div className="isen-corpo">
      <div>
        <Sobe tag="h2" atraso={60}>Da perícia à chave na mão</Sobe>
        <Sobe tag="p" atraso={420} className="isen-aviso">
          <Icone nome="escudo" tam={14} />
          Prazos e tetos de valor mudam por estado e por ano. O site mostra a regra
          vigente no anúncio, mas a palavra final é do órgão.
        </Sobe>
      </div>
      <ol className="isen-passos">
        {passos.map(([t, d], i) => (
          <Sobe key={t} tag="li" atraso={80 + i * 80}>
            <span className="isen-n mono">{i + 1}</span>
            <div>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          </Sobe>
        ))}
      </ol>
      </div>
    </section>
  );
}

export function Rodape() {
  return (
    <footer className="rodape">
      <div className="rodape-dentro">
        <div className="rodape-marca">
          <Marca tam={34} />
          <b>PCD<span>MOTORS</span></b>
          <p>O carro certo já vem adaptado.</p>
        </div>
        <div className="rodape-cols">
          <div>
            <h4>Projeto</h4>
            <p>Projeto Integrador I</p>
            <p>Itapetininga &middot; SP</p>
          </div>
          <div>
            <h4>Equipe</h4>
            <p>Kayke Müller Diniz</p>
            <p>Gabriel Kazuo Seckler</p>
            <p>Cibele Santiago Soares</p>
          </div>
          <div>
            <h4>Protótipo</h4>
            <p>Catálogo fictício</p>
            <p>Fotos do vídeo do projeto</p>
            <p>Marcas: car-logos-dataset (MIT)</p>
          </div>
        </div>
      </div>
      <p className="rodape-fim mono">
        Demonstração acadêmica. Não há venda, cadastro ou coleta de dados nesta página.
      </p>
    </footer>
  );
}
