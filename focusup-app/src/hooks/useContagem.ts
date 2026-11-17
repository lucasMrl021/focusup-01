import { useEffect, useState } from 'react';

/**
 * Contagem regressiva baseada no horário de término (não em "tique" a tique),
 * então continua certa mesmo se o app ficar em segundo plano.
 */
export function useContagem(fimEmMs: number, agora: () => number = Date.now) {
  const calc = () => Math.max(0, Math.ceil((fimEmMs - agora()) / 1000));
  const [restante, setRestante] = useState(calc);

  useEffect(() => {
    setRestante(calc());
    const id = setInterval(() => {
      const r = calc();
      setRestante(r);
      if (r <= 0) clearInterval(id);
    }, 250);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fimEmMs]);

  return restante;
}
