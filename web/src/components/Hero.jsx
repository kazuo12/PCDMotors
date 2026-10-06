import { useEffect, useRef, useState } from 'react';
import Marca, { ARCO } from './Marca';
import { QUADROS } from '../data/quadros';
import { avancar, criar, inscrever, parado } from '../lib/mola';
import { faixa, suave, REDUZIDO } from '../lib/util';

// Mola do scrub: rigida e SUPERamortecida de proposito. Com qualquer
// oscilacao o carro andaria de re por um instante ao parar de rolar, que e
// muito mais feio do que o engasgo que ela veio resolver.
// Amortecimento critico em k=260 seria 2*sqrt(260) = 32,2; fico acima disso.
const SCRUB = { rigidez: 260, atrito: 36, massa: 1 };

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
    const mola = criar(0);
    let prontos = 0;
    let pintado = null;   // assinatura do que esta REALMENTE na tela
    let vivo = true;

    const progresso = () => {
      const alcance = sec.offsetHeight - innerHeight;
      if (alcance <= 0) return 0;
      return Math.max(0, Math.min(1, -sec.getBoundingClientRect().top / alcance));
    };
    // Indice FRACIONARIO. Arredondar era a causa do engasgo: o quadro ficava
    // parado por dezenas de pixels de rolagem e entao pulava de uma vez.
    const indiceAlvo = () =>
      REDUZIDO ? QUADROS.length - 1
        : faixa(progresso(), 0, 0.78) * (QUADROS.length - 1);

    // Procura o vizinho ja decodificado mais proximo -- melhor um quadro
    // adiantado do que tela preta enquanto a sequencia ainda carrega.
    function pronta(i) {
      const img = imgs[i];
      if (img && img.complete && img.naturalWidth) return img;
      for (let d = 1; d < QUADROS.length; d++) {
        const a = imgs[i - d], b = imgs[i + d];
        if (a && a.complete && a.naturalWidth) return a;
        if (b && b.complete && b.naturalWidth) return b;
      }
      return null;
    }

    function cobrir(img, alfa) {
      const cw = cv.width, ch = cv.height;
      const e = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * e, h = img.naturalHeight * e;
      ctx.globalAlpha = alfa;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
      ctx.globalAlpha = 1;
    }

    function desenhar(f) {
      f = Math.max(0, Math.min(QUADROS.length - 1, f));
      const i0 = Math.floor(f);
      const mistura = f - i0;
      const a = pronta(i0);
      if (!a) return;
      const b = mistura > 0.012 ? pronta(Math.min(QUADROS.length - 1, i0 + 1)) : null;

      // Nada mudou o suficiente para valer uma repintura de tela cheia.
      const assin = a.src + '|' + (b ? b.src + '|' + mistura.toFixed(2) : '');
      if (assin === pintado) return;
      pintado = assin;

      cobrir(a, 1);
      // O segundo quadro entra por cima com alfa = fracao, o que da
      // exatamente a interpolacao linear entre os dois. Em movimento rapido
      // isso le como borrao de movimento; parado, some sozinho.
      if (b && b !== a) cobrir(b, mistura);
    }

    // Nasce ja no alvo. Sem isto, recarregar a pagina com o scroll restaurado
    // no meio do hero -- ou abrir com movimento reduzido, onde o alvo e o
    // ultimo quadro -- fazia a sequencia correr desde o quadro 0 na primeira
    // rolagem.
    mola.valor = indiceAlvo();

    function medir() {
      const r = Math.min(devicePixelRatio || 1, 2);
      cv.width = Math.round(innerWidth * r);
      cv.height = Math.round(innerHeight * r);
      cv.style.width = innerWidth + 'px';
      cv.style.height = innerHeight + 'px';
      pintado = null;         // o canvas foi limpo pelo resize
      desenhar(mola.valor);
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
        desenhar(mola.valor);
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

    function pintar(p) {
      const o = alvos;
      if (o) {
        o.style.setProperty('--veu', suave(faixa(p, 0.52, 0.80)).toFixed(3));
        o.style.setProperty('--selo', suave(faixa(p, 0.58, 0.72)).toFixed(3));
        o.style.setProperty('--assin', suave(faixa(p, 0.80, 0.88)).toFixed(3));
        // A dica de rolagem agora resiste: so comeca a sumir depois que a
        // pessoa ja percorreu um terco da abertura, e o mostrador dela
        // acompanha o mesmo trecho que move o carro.
        o.style.setProperty('--dica', (1 - suave(faixa(p, 0.34, 0.55))).toFixed(3));
        o.style.setProperty('--volta', faixa(p, 0, 0.78).toFixed(4));
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

    // O laco nao pode viver so no evento de scroll: a mola ainda tem caminho
    // a percorrer DEPOIS do ultimo evento, e e justamente esse rabo que tira
    // o solavanco do fim do gesto. Ele roda enquanto houver distancia a
    // cobrir e se desliga sozinho ao assentar.
    let soltar = null;
    function girar() {
      if (soltar) return;
      soltar = inscrever((dt) => {
        const alvo = indiceAlvo();
        if (REDUZIDO) { mola.valor = alvo; mola.v = 0; }
        else avancar(mola, alvo, SCRUB, dt);
        desenhar(mola.valor);
        pintar(progresso());
        if (parado(mola, alvo, 0.004)) {
          mola.valor = alvo; mola.v = 0;
          desenhar(mola.valor);
          soltar(); soltar = null;
        }
      });
    }

    medir();
    pintar(progresso());
    const acordar = () => girar();
    addEventListener('scroll', acordar, { passive: true });
    addEventListener('resize', medir);
    return () => {
      vivo = false;
      removeEventListener('scroll', acordar);
      removeEventListener('resize', medir);
      soltar?.();
    };
  }, [aoProgredir]);

  return (
    <section className="hero" ref={secao} aria-label="Abertura">
      <div className="hero-fixo">
        <canvas ref={canvas} className="hero-tela" aria-hidden="true" />
        <div className="hero-palco" ref={palco}>
          <div className="hero-veu" aria-hidden="true" />

          {/* Antes isto era a palavra "role" e um risco de 1px, que e
              exatamente o tipo de dica que ninguem ve. Agora e um mostrador
              que enche conforme a pessoa desce: diz o que fazer, mostra que
              esta funcionando e quanto falta. */}
          <div className="hero-dica" aria-hidden="true">
            <svg className="hero-dica-rel" viewBox="0 0 48 48" width="68" height="68"
                 fill="none" strokeLinecap="round">
              <path className="hdr-trilho" d={ARCO} strokeWidth="3.4" />
              <path className="hdr-volta" d={ARCO} strokeWidth="3.4" pathLength="100" />
              <g className="hdr-agulha">
                <path d="M23 26.6 L23 12.4" strokeWidth="3.2" />
              </g>
              <circle className="hdr-miolo" cx="23" cy="26.6" r="3.1" />
            </svg>
            <span className="hero-dica-texto">Role para baixo</span>
            <svg className="hero-dica-seta" viewBox="0 0 24 14" width="22" height="13"
                 fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M3 3l9 8 9-8" />
            </svg>
          </div>

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
