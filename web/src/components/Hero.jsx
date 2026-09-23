import { useEffect, useRef, useState } from 'react';
import Marca from './Marca';
import { QUADROS } from '../data/quadros';
import { faixa, suave, REDUZIDO } from '../lib/util';

const LETRAS = [...'PCD MOTORS'];

// O hero e um <canvas> preso na tela enquanto o container alto rola por tras.
// Rolar nao "toca" um video: escolhe o quadro. Fiz com sequencia de imagens em
// vez de mexer no currentTime de um <video> porque seek em MP4 salta para o
// keyframe anterior e a imagem engasga a cada arrasto.
export default function Hero({ aoProgredir }) {
  const secao = useRef(null);
  const canvas = useRef(null);
  const palco = useRef(null);
  const [carregado, setCarregado] = useState(REDUZIDO);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const cv = canvas.current;
    const sec = secao.current;
    if (!cv || !sec) return;
    const ctx = cv.getContext('2d', { alpha: false });

    const imgs = new Array(QUADROS.length);
    let prontos = 0;
    let pintado = null;   // a imagem que esta REALMENTE na tela
    let vivo = true;

    const progresso = () => {
      const alcance = sec.offsetHeight - innerHeight;
      if (alcance <= 0) return 0;
      return Math.max(0, Math.min(1, -sec.getBoundingClientRect().top / alcance));
    };
    const indice = () =>
      REDUZIDO ? QUADROS.length - 1
        : Math.round(faixa(progresso(), 0, 0.78) * (QUADROS.length - 1));

    function desenhar(i) {
      i = Math.max(0, Math.min(QUADROS.length - 1, i));
      let img = imgs[i];
      // Enquanto o quadro exato nao decodificou, usa o vizinho mais proximo
      // que ja esta pronto -- melhor um quadro adiantado do que tela preta.
      if (!img || !img.complete || !img.naturalWidth) {
        for (let d = 1; d < QUADROS.length; d++) {
          const a = imgs[i - d], b = imgs[i + d];
          if (a && a.complete && a.naturalWidth) { img = a; break; }
          if (b && b.complete && b.naturalWidth) { img = b; break; }
        }
      }
      if (!img || img === pintado) return;
      pintado = img;
      const cw = cv.width, ch = cv.height;
      const e = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * e, h = img.naturalHeight * e;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    }

    function medir() {
      const r = Math.min(devicePixelRatio || 1, 2);
      cv.width = Math.round(innerWidth * r);
      cv.height = Math.round(innerHeight * r);
      cv.style.width = innerWidth + 'px';
      cv.style.height = innerHeight + 'px';
      pintado = null;         // o canvas foi limpo pelo resize
      desenhar(indice());
    }

    QUADROS.forEach((src, i) => {
      const img = new Image();
      img.decoding = 'async';
      imgs[i] = img;          // antes do src: data: URI pode resolver na hora
      const chegou = () => {
        if (!vivo) return;
        prontos++;
        setPct(Math.round((prontos / QUADROS.length) * 100));
        // Com data: URI o img.complete vira true ANTES de os pixels existirem,
        // e ai drawImage nao faz nada e mesmo assim marcamos como pintado --
        // era esse o bug do primeiro quadro preto. Zerar forca a repintura.
        pintado = null;
        desenhar(indice());
        if (prontos >= Math.min(14, QUADROS.length)) setCarregado(true);
      };
      img.onerror = chegou;
      img.onload = () => {
        if (img.decode) img.decode().then(chegou, chegou);
        else chegou();
      };
      img.src = src;
    });

    // Escrita direta no DOM: o hero repinta a cada quadro de rolagem e passar
    // isso por setState seria re-render a 60Hz da arvore inteira.
    const alvos = palco.current;
    let pedido = 0;

    function pintar() {
      pedido = 0;
      const p = progresso();
      desenhar(indice());

      const o = alvos;
      if (o) {
        o.style.setProperty('--veu', suave(faixa(p, 0.52, 0.80)).toFixed(3));
        o.style.setProperty('--selo', suave(faixa(p, 0.58, 0.72)).toFixed(3));
        o.style.setProperty('--assin', suave(faixa(p, 0.80, 0.88)).toFixed(3));
        o.style.setProperty('--dica', (1 - faixa(p, 0.02, 0.14)).toFixed(3));
        for (let i = 0; i < LETRAS.length; i++) {
          o.style.setProperty(
            `--l${i}`,
            suave(faixa(p, 0.64 + i * 0.011, 0.76 + i * 0.011)).toFixed(3),
          );
        }
      }
      // O documento inteiro atravessa de noite para papel na saida do hero.
      // E o que faz a pagina parecer uma rolagem so, sem sessoes empilhadas.
      document.documentElement.style.setProperty('--dia', suave(faixa(p, 0.74, 0.97)).toFixed(3));
      aoProgredir?.(p);
    }

    const agendar = () => { if (!pedido) pedido = requestAnimationFrame(pintar); };

    medir();
    pintar();
    addEventListener('scroll', agendar, { passive: true });
    addEventListener('resize', medir);
    return () => {
      vivo = false;
      removeEventListener('scroll', agendar);
      removeEventListener('resize', medir);
      if (pedido) cancelAnimationFrame(pedido);
    };
  }, [aoProgredir]);

  return (
    <section className="hero" ref={secao} aria-label="Abertura">
      <div className="hero-fixo">
        <canvas ref={canvas} className="hero-tela" aria-hidden="true" />
        <div className="hero-palco" ref={palco}>
          <div className="hero-veu" aria-hidden="true" />

          <p className="hero-dica" aria-hidden="true">
            <span>role</span>
            <i />
          </p>

          <div className="hero-marca">
            <span className="hero-selo" aria-hidden="true"><Marca tam={64} /></span>
            <h1 className="hero-nome">
              <span className="oculto-visual">PCD Motors</span>
              {LETRAS.map((c, i) => (
                <span key={i} aria-hidden="true" className={c === ' ' ? 'vao' : 'letra'}
                      style={{ '--op': `var(--l${i})` }}>
                  {c === ' ' ? ' ' : c}
                </span>
              ))}
            </h1>
            <p className="hero-assin">
              O carro certo já vem adaptado.
              <span>Marketplace de veículos PcD &middot; Itapetininga&nbsp;SP</span>
            </p>
          </div>
        </div>

        <div className={'hero-carga' + (carregado ? ' pronto' : '')} aria-hidden="true">
          <i style={{ width: pct + '%' }} />
        </div>
      </div>
    </section>
  );
}
