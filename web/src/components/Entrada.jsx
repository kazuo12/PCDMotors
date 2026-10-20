import { useEffect, useRef, useState } from 'react';
import carroUrl from '../assets/entrada/carro.webp';
import farolUrl from '../assets/entrada/farol.webp';
import { ARCO } from './Marca';
import { faixa, suave, REDUZIDO } from '../lib/util';

const LETRAS = [...'PCD MOTORS'];

// Posicao dos farois, medida nos pixels da propria imagem (centroide de cada
// grupo de pixels acima do limiar de brilho). E daqui que saem os feixes e o
// clarao no chao -- chutar no olho deixa a luz fora do farol.
const FAROL = { e: { x: 29.73, y: 53.65 }, d: { x: 69.48, y: 53.52 } };

// A entrada tem dois tempos:
//   1. ignicao, por relogio: o farol pisca e firma sozinho assim que carrega,
//      sem depender de a pessoa rolar;
//   2. o resto, pela rolagem: a luz cresce, o carro se aproxima e o nome
//      aparece.
// Misturar os dois no mesmo valor daria briga, entao a opacidade final da luz
// e o PRODUTO de duas camadas aninhadas -- o pisca na de dentro, a rolagem na
// de fora.
export default function Entrada({ aoProgredir }) {
  const secao = useRef(null);
  const palco = useRef(null);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    let vivo = true;
    let faltam = 2;
    const chegou = () => { if (vivo && --faltam === 0) setPronto(true); };
    for (const src of [carroUrl, farolUrl]) {
      const img = new Image();
      img.onload = () => (img.decode ? img.decode().then(chegou, chegou) : chegou());
      img.onerror = chegou;
      img.src = src;
    }
    return () => { vivo = false; };
  }, []);

  useEffect(() => {
    const sec = secao.current;
    const o = palco.current;
    if (!sec || !o) return;

    const progresso = () => {
      const alcance = sec.offsetHeight - innerHeight;
      if (alcance <= 0) return 0;
      return Math.max(0, Math.min(1, -sec.getBoundingClientRect().top / alcance));
    };

    let pedido = 0;
    function pintar() {
      pedido = 0;
      const p = progresso();

      // A luz sobe ao talo e depois RECUA quando o nome entra. Deixar os dois
      // no brilho maximo faz as letras disputarem com o farol bem atras delas;
      // o farol abrir caminho para o nome e a passagem de bastao da abertura.
      const acende = suave(faixa(p, 0, 0.34));
      const recua = suave(faixa(p, 0.36, 0.58));
      o.style.setProperty('--brilho', (0.62 + acende * 0.38 - recua * 0.30).toFixed(3));
      // Veu por tras do nome: garante contraste onde o farol e mais forte.
      o.style.setProperty('--veu', (suave(faixa(p, 0.33, 0.55)) * 0.74).toFixed(3));
      // O carro vem na direcao de quem olha, de leve. Exagerar aqui e o que
      // faz uma abertura parecer efeito de template.
      o.style.setProperty('--aprox', (1 + suave(faixa(p, 0.04, 0.56)) * 0.14).toFixed(4));
      o.style.setProperty('--assin', suave(faixa(p, 0.60, 0.74)).toFixed(3));
      o.style.setProperty('--dica', (1 - suave(faixa(p, 0.30, 0.52))).toFixed(3));
      o.style.setProperty('--volta', faixa(p, 0, 0.74).toFixed(4));
      for (let i = 0; i < LETRAS.length; i++) {
        o.style.setProperty(`--l${i}`, suave(faixa(p, 0.36 + i * 0.012, 0.50 + i * 0.012)).toFixed(3));
      }
      // A pagina inteira atravessa da noite para o papel na saida da entrada.
      document.documentElement.style.setProperty('--dia', suave(faixa(p, 0.72, 0.96)).toFixed(3));
      aoProgredir?.(p);
    }

    const agendar = () => { if (!pedido) pedido = requestAnimationFrame(pintar); };
    pintar();
    addEventListener('scroll', agendar, { passive: true });
    addEventListener('resize', agendar);
    return () => {
      removeEventListener('scroll', agendar);
      removeEventListener('resize', agendar);
      if (pedido) cancelAnimationFrame(pedido);
    };
  }, [aoProgredir]);

  const posicao = (f) => ({ left: `${f.x}%`, top: `${f.y}%` });

  return (
    <section className="entrada" ref={secao} aria-label="Abertura">
      <div className={'entrada-fixo' + (pronto ? ' acesa' : '')}>
        <div className="entrada-palco" ref={palco}>

          <div className="entrada-cena" aria-hidden="true">
            {/* poeira no ar, so para o feixe ter em que se apoiar */}
            <span className="entrada-ar" />
            {/* O quadro tem a medida exata da imagem. Os feixes sao
                posicionados em % DELE, nao da tela -- em % da tela a luz
                sairia de um ponto qualquer, longe do farol. */}
            <div className="entrada-quadro">
              <img className="entrada-carro" src={carroUrl} alt="" width="1094" height="730" />
              {/* a luz e uma camada propria: e ela que acende */}
              <span className="entrada-luz">
                <img src={farolUrl} alt="" width="1094" height="730" />
              </span>
              <span className="entrada-feixe" style={posicao(FAROL.e)} />
              <span className="entrada-feixe" style={posicao(FAROL.d)} />
            </div>
            <span className="entrada-chao" />
            {/* A imagem e um retangulo e o fundo dela nao e preto puro, entao
                a borda dela aparecia como um retangulo mais claro sobre a
                pagina. A vinheta apaga isso e de quebra fecha o olhar no
                carro. */}
            <span className="entrada-vinheta" />
          </div>

          <span className="entrada-veu" aria-hidden="true" />

          <div className="entrada-marca">
            <h1 className="entrada-nome">
              <span className="oculto-visual">PCD Motors</span>
              {LETRAS.map((c, i) => (
                <span key={i} aria-hidden="true" className={c === ' ' ? 'vao' : 'letra'}
                      style={{ '--op': `var(--l${i})` }}>
                  {c === ' ' ? ' ' : c}
                </span>
              ))}
            </h1>
            <p className="entrada-assin">
              O carro certo já vem adaptado.
              <span>Marketplace de veículos PcD &middot; Itapetininga&nbsp;SP</span>
            </p>
          </div>

          <div className="hero-dica" aria-hidden="true">
            <svg className="hero-dica-rel" viewBox="0 0 48 48" width="68" height="68"
                 fill="none" strokeLinecap="round">
              <path className="hdr-trilho" d={ARCO} strokeWidth="3.4" />
              <path className="hdr-volta" d={ARCO} strokeWidth="3.4" pathLength="100" />
              <g className="hdr-agulha"><path d="M23 26.6 L23 12.4" strokeWidth="3.2" /></g>
              <circle className="hdr-miolo" cx="23" cy="26.6" r="3.1" />
            </svg>
            <span className="hero-dica-texto">Role para baixo</span>
            <svg className="hero-dica-seta" viewBox="0 0 24 14" width="22" height="13"
                 fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M3 3l9 8 9-8" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
