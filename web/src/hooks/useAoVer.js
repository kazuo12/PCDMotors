import { useEffect, useRef, useState } from 'react';

// Marca o elemento como visto uma vez e nao volta atras: conteudo que
// reaparece piscando a cada scroll e pior do que nao animar.
export function useAoVer(margem = '0px 0px -12% 0px') {
  const alvo = useRef(null);
  const [visto, setVisto] = useState(false);

  useEffect(() => {
    const el = alvo.current;
    if (!el || visto) return;
    if (typeof IntersectionObserver !== 'function') { setVisto(true); return; }
    const obs = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((e) => e.isIntersecting)) { setVisto(true); obs.disconnect(); }
      },
      { rootMargin: margem, threshold: 0.08 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [margem, visto]);

  return [alvo, visto];
}
