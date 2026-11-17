import type { Sessao } from '../src/api/types';
import { agruparPorDia } from '../src/domain/historico';
import { fracaoDoNivel, inicioDoNivel } from '../src/domain/niveis';

const sessao = (id: number, dia: string, duracaoMinutos: number): Sessao => ({
  id,
  dia,
  duracaoMinutos,
  status: 'CONCLUIDA',
  inicio: `${dia}T10:00:00Z`,
  fim: `${dia}T10:25:00Z`,
  pontos: 25,
});

describe('níveis (mesma regra do backend)', () => {
  it('cada nível começa em 125 × n × (n − 1) pontos', () => {
    expect([1, 2, 3, 4, 5].map(inicioDoNivel)).toEqual([0, 250, 750, 1500, 2500]);
  });
  it('calcula a fração da barra', () => {
    expect(fracaoDoNivel(1240, 750, 1500)).toBeCloseTo(0.6533, 3);
    expect(fracaoDoNivel(2000, 750, 1500)).toBe(1);
    expect(fracaoDoNivel(0, 0, 250)).toBe(0);
  });
});

describe('histórico agrupado por dia', () => {
  it('mantém a ordem e soma os minutos de cada dia', () => {
    const grupos = agruparPorDia([sessao(3, '2026-11-04', 25), sessao(2, '2026-11-04', 45), sessao(1, '2026-11-03', 15)]);
    expect(grupos).toHaveLength(2);
    expect(grupos[0]).toMatchObject({ dia: '2026-11-04', minutos: 70 });
    expect(grupos[0].sessoes.map((s) => s.id)).toEqual([3, 2]);
    expect(grupos[1]).toMatchObject({ dia: '2026-11-03', minutos: 15 });
  });
  it('lista vazia gera nenhum grupo', () => {
    expect(agruparPorDia([])).toEqual([]);
  });
});
