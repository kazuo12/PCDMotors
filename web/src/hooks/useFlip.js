import { useCallback, useLayoutEffect, useRef } from 'react';
import { PRESETS, avancar, criar, inscrever, parado } from '../lib/mola';
import { REDUZIDO } from '../lib/util';

// FLIP: mede antes (First), deixa o React repintar, mede depois (Last),
// inverte com transform e solta (Play). O navegador nunca anima `top`/`order`;
// a lista pula, e a gente desfaz o pulo visualmente.
//
// Pegadinha que custou caro: se `registrar(chave)` devolver uma funcao nova a
// cada render, o React desanexa e reanexa TODA ref em TODO render -- a limpeza
// apaga o mapa de medidas e o FLIP nunca roda. Por isso as callbacks ficam
// num cache por chave.
export function useFlip(dependencia) {
  const nos = useRef(new Map());
  const callbacks = useRef(new Map());
  const primeiro = useRef(new Map());

  const registrar = useCallback((chave) => {
    let cb = callbacks.current.get(chave);
    if (!cb) {
      cb = (el) => {
        if (el) nos.current.set(chave, el);
        else nos.current.delete(chave);
      };
      callbacks.current.set(chave, cb);
    }
    return cb;
  }, []);

  // Antes do repaint que muda a lista, guarda onde cada item estava.
  const medir = useCallback(() => {
    primeiro.current.clear();
    for (const [chave, el] of nos.current) {
      primeiro.current.set(chave, el.getBoundingClientRect());
    }
  }, []);

  useLayoutEffect(() => {
    if (REDUZIDO || !primeiro.current.size) { primeiro.current.clear(); return; }

    const animar = [];
    for (const [chave, el] of nos.current) {
      const antes = primeiro.current.get(chave);
      if (!antes) continue;
      const agora = el.getBoundingClientRect();
      const dx = antes.left - agora.left;
      const dy = antes.top - agora.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) continue;
      animar.push({ el, dx, dy, dist: Math.hypot(dx, dy) });
    }
    primeiro.current.clear();
    if (!animar.length) return;

    // O atraso sai da distancia percorrida, nao de indice x 40ms. Quem anda
    // mais sai depois, entao o olho segue a reordenacao em vez de ver uma
    // cascata mecanica.
    const maior = Math.max(...animar.map((a) => a.dist)) || 1;
    for (const a of animar) {
      a.atraso = (a.dist / maior) * 0.06;
      a.t = 0;
      a.x = criar(a.dx);
      a.y = criar(a.dy);
      a.el.style.willChange = 'transform';
      a.el.style.transform = `translate3d(${a.dx}px,${a.dy}px,0)`;
    }

    const parar = inscrever((dt) => {
      let vivos = 0;
      for (const a of animar) {
        if (a.pronto) continue;
        a.t += dt;
        if (a.t < a.atraso) { vivos++; continue; }
        avancar(a.x, 0, PRESETS.layout, dt);
        avancar(a.y, 0, PRESETS.layout, dt);
        if (parado(a.x, 0, 0.25) && parado(a.y, 0, 0.25)) {
          a.pronto = true;
          a.el.style.transform = '';
          a.el.style.willChange = '';
          continue;
        }
        vivos++;
        a.el.style.transform = `translate3d(${a.x.valor.toFixed(2)}px,${a.y.valor.toFixed(2)}px,0)`;
      }
      if (!vivos) parar();
    });
    return parar;
  }, [dependencia]);

  return { registrar, medir };
}
