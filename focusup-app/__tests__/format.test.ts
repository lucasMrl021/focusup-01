import { formatarMinutos, formatarPontos, formatarRelogio, letraDoDia, rotuloDoDia, saudacao } from '../src/domain/format';

describe('formatarMinutos', () => {
  it('usa o formato das telas', () => {
    expect(formatarMinutos(0)).toBe('0 min');
    expect(formatarMinutos(45)).toBe('45 min');
    expect(formatarMinutos(60)).toBe('1h');
    expect(formatarMinutos(70)).toBe('1h10');
    expect(formatarMinutos(125)).toBe('2h05');
    expect(formatarMinutos(-5)).toBe('0 min');
  });
});

describe('formatarPontos', () => {
  it('separa milhar com ponto', () => {
    expect(formatarPontos(25)).toBe('25');
    expect(formatarPontos(1240)).toBe('1.240');
    expect(formatarPontos(1234567)).toBe('1.234.567');
  });
});

describe('formatarRelogio', () => {
  it('mostra minutos e segundos com dois dígitos', () => {
    expect(formatarRelogio(1500)).toBe('25:00');
    expect(formatarRelogio(1103)).toBe('18:23');
    expect(formatarRelogio(9)).toBe('00:09');
    expect(formatarRelogio(0)).toBe('00:00');
    expect(formatarRelogio(-3)).toBe('00:00');
  });
});

describe('datas', () => {
  const hoje = new Date(2026, 10, 4, 15, 0); // quarta, 4 de novembro de 2026
  it('chama de Hoje e Ontem os dias mais recentes', () => {
    expect(rotuloDoDia('2026-11-04', hoje)).toBe('Hoje');
    expect(rotuloDoDia('2026-11-03', hoje)).toBe('Ontem');
    expect(rotuloDoDia('2026-11-02', hoje)).toBe('seg, 2 nov');
  });
  it('dá a letra do dia da semana', () => {
    expect(letraDoDia('2026-11-01')).toBe('D');
    expect(letraDoDia('2026-11-04')).toBe('Q');
  });
});

describe('saudacao', () => {
  it('muda com a hora', () => {
    expect(saudacao(8)).toBe('Bom dia,');
    expect(saudacao(14)).toBe('Boa tarde,');
    expect(saudacao(21)).toBe('Boa noite,');
    expect(saudacao(2)).toBe('Boa noite,');
  });
});
