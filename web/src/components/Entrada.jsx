import { useEffect, useRef, useState } from 'react';
import carroUrl from '../assets/entrada/carro.webp';
import farolUrl from '../assets/entrada/farol.webp';
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

  // A abertura: relogio proprio. Toca ao carregar e toca DE NOVO toda vez que
  // a pessoa volta ao topo -- antes era uma chance so, e quem piscasse ou
  // chegasse rolando nunca mais via.
  const [tomada, setTomada] = useState(0);
  useEffect(() => {
    if (!pronto) return;
    let noTopo = true;
    const olhar = () => {
      const topo = scrollY < 40;
      if (topo && !noTopo) setTomada((n) => n + 1);
      noTopo = topo;
    };
    addEventListener('scroll', olhar, { passive: true });
    return () => removeEventListener('scroll', olhar);
  }, [pronto]);

  useEffect(() => {
    const o = palco.current;
    if (!o || !pronto) return;
    o.classList.remove('fim');

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
  }, [pronto, tomada]);

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

          {/* So a seta. O texto "role para baixo" e o mostrador faziam a
              abertura parecer comandada pela rolagem, que e justamente o que
              ela nao e. */}
          <span className="entrada-seta" aria-hidden="true">
            <svg viewBox="0 0 28 16" width="26" height="15" fill="none"
                 stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M3 3.5l11 9 11-9" />
            </svg>
          </span>
        </div>
      </div>
    </section>
  );
}
