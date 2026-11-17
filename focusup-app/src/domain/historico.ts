import type { Sessao } from '../api/types';

/** Agrupa as sessões por dia, mantendo a ordem da mais recente para a mais antiga. */
export function agruparPorDia(sessoes: Sessao[]): { dia: string; minutos: number; sessoes: Sessao[] }[] {
  const grupos: { dia: string; minutos: number; sessoes: Sessao[] }[] = [];
  for (const s of sessoes) {
    const dia = s.dia ?? '';
    let g = grupos[grupos.length - 1];
    if (!g || g.dia !== dia) {
      g = { dia, minutos: 0, sessoes: [] };
      grupos.push(g);
    }
    g.sessoes.push(s);
    g.minutos += s.duracaoMinutos;
  }
  return grupos;
}
