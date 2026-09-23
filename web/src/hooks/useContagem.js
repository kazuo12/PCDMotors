import { useEffect, useRef, useState } from 'react';
import { PRESETS, avancar, criar, inscrever, parado } from '../lib/mola';
import { REDUZIDO } from '../lib/util';

// Numero que persegue o alvo com mola. Se o alvo mudar no meio do caminho,
// o valor NAO reinicia -- continua da velocidade atual, que e o ponto de usar
// mola em vez de uma transicao com duracao.
export function useContagem(alvo, ativo = true) {
  const [valor, setValor] = useState(alvo);
  const estado = useRef(null);

  useEffect(() => {
    if (REDUZIDO || !ativo) { setValor(alvo); return; }
    if (!estado.current) estado.current = criar(alvo);
    const s = estado.current;
    if (parado(s, alvo, 0.05)) { setValor(alvo); return; }
    return inscrever((dt) => {
      avancar(s, alvo, PRESETS.contador, dt);
      if (parado(s, alvo, 0.05)) {
        s.valor = alvo; s.v = 0;
        setValor(alvo);
        return;
      }
      setValor(s.valor);
    });
  }, [alvo, ativo]);

  return valor;
}
