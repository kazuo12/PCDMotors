import { useEffect, useRef, useState } from 'react';
import carroUrl from '../assets/entrada/carro.webp';
import farolUrl from '../assets/entrada/farol.webp';
import { ARCO } from './Marca';
import { faixa, suave, REDUZIDO } from '../lib/util';
import { inscrever } from '../lib/mola';

const LETRAS = [...'PCD MOTORS'];

// Centro de cada farol, medido nos pixels da imagem (centroide dos pixels
// acima do limiar de brilho). E daqui que a luz nasce e e daqui que o carro
// e revelado -- chutar no olho poe a luz fora do farol.
const FAROL = { e: { x: 29.73, y: 53.65 }, d: { x: 69.48, y: 53.52 } };

// Roteiro da abertura, em segundos. Toca sozinho ao abrir o site: nao depende
// de rolagem nenhuma.
const T = {
  escuro: [0.00, 0.35],   // preto total, nada na tela
  ignicao: [0.35, 1.45],  // o farol estala, hesita e firma
  revela: [1.10, 2.90],   // a luz se abre e o carro aparece onde ela chega
  nome: [2.45, 3.55],
  assin: [3.35, 4.20],
  dica: [4.10, 4.80],
};
const FIM = 4.8;

export default function Entrada({ aoProgredir }) {
  const secao = useRef(null);
  const palco = useRef(null);
  const [pronto, setPronto] = useState(false);

  // Espera as duas imagens decodificarem antes de comecar: se a animacao roda
  // sem elas, a luz acende sobre nada e o carro aparece depois, fora do tempo.
  useEffect(() => {
    let vivo = true, faltam = 2;
    const chegou = () => { if (vivo && --faltam === 0) setPronto(true); };
    for (const src of [carroUrl, farolUrl]) {
      const img = new Image();
      img.onload = () => (img.decode ? img.decode().then(chegou, chegou) : chegou());
      img.onerror = chegou;
      img.src = src;
    }
    return () => { vivo = false; };
  }, []);

  // A abertura: relogio proprio, uma passagem so.
  useEffect(() => {
    const o = palco.current;
    if (!o || !pronto) return;

    const por = (t, [a, b]) => suave(faixa(t, a, b));
    const aplicar = (t) => {
      o.style.setProperty('--acende', por(t, T.ignicao).toFixed(3));
      o.style.setProperty('--revela', por(t, T.revela).toFixed(3));
      o.style.setProperty('--assin', por(t, T.assin).toFixed(3));
      o.style.setProperty('--dica', por(t, T.dica).toFixed(3));
      for (let i = 0; i < LETRAS.length; i++) {
        const atraso = i * 0.055;
        o.style.setProperty(`--l${i}`,
          por(t, [T.nome[0] + atraso, T.nome[1] + atraso]).toFixed(3));
      }
    };

    if (REDUZIDO) { aplicar(FIM); o.classList.add('fim'); return; }

    let t = 0;
    const soltar = inscrever((dt) => {
      t += dt;
      aplicar(Math.min(t, FIM));
      if (t >= FIM) { o.classList.add('fim'); soltar(); }
    });
    return soltar;
  }, [pronto]);

  // A rolagem nao conduz mais a abertura; so leva a pagina da noite para o dia
  // ao sair dela.
  useEffect(() => {
    const sec = secao.current;
    if (!sec) return;
    let pedido = 0;
    const pintar = () => {
      pedido = 0;
      const alcance = innerHeight;
      const p = Math.max(0, Math.min(1, -sec.getBoundingClientRect().top / alcance));
      document.documentElement.style.setProperty('--dia', suave(faixa(p, 0.08, 0.72)).toFixed(3));
      aoProgredir?.(p);
    };
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

  // Brilho do farol desenhado em CSS, nao recortado da imagem: nucleo, estrela
  // e risco horizontal ficam nitidos em qualquer tela, e e justamente a parte
  // que o olho procura.
  const flare = (f, lado) => (
    <span className={'ent-flare ent-flare-' + lado} key={lado}
          style={{ left: `${f.x}%`, top: `${f.y}%` }}>
      <i className="ent-nucleo" />
      <i className="ent-estrela" />
      <i className="ent-risco" />
    </span>
  );

  return (
    <section className="entrada" ref={secao} aria-label="Abertura">
      <div className={'entrada-fixo' + (pronto ? ' acesa' : '')}>
        <div className="entrada-palco" ref={palco}>

          <div className="entrada-cena" aria-hidden="true">
            <div className="entrada-quadro">
              {/* O carro e mascarado por dois circulos que crescem a partir
                  dos farois. Enquanto o raio e zero nao ha carro nenhum na
                  tela -- o preto e preto de verdade, nao foto escurecida. */}
              <img className="entrada-carro" src={carroUrl} alt=""
                   width="1641" height="1095" />
              <span className="entrada-luz">
                <img src={farolUrl} alt="" width="1641" height="1095" />
              </span>
              {flare(FAROL.e, 'e')}
              {flare(FAROL.d, 'd')}
            </div>
            <span className="entrada-chao" />
            <span className="entrada-vinheta" />
          </div>

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
            <svg className="hero-dica-rel" viewBox="0 0 48 48" width="56" height="56"
                 fill="none" strokeLinecap="round">
              <path className="hdr-trilho" d={ARCO} strokeWidth="3.4" />
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
