/** Formatação de números e tempos no padrão brasileiro usado nas telas. */

/** 70 → "1h10", 120 → "2h", 45 → "45 min", 0 → "0 min". */
export function formatarMinutos(minutos: number): string {
  const m = Math.max(0, Math.round(minutos));
  const horas = Math.floor(m / 60);
  const resto = m % 60;
  if (horas === 0) return `${resto} min`;
  if (resto === 0) return `${horas}h`;
  return `${horas}h${String(resto).padStart(2, '0')}`;
}

/** 1240 → "1.240". */
export function formatarPontos(pontos: number): string {
  return Math.round(pontos)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/** 1103 segundos → "18:23". */
export function formatarRelogio(segundos: number): string {
  const s = Math.max(0, Math.ceil(segundos));
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
}

/** "Bom dia", "Boa tarde" ou "Boa noite" conforme a hora. */
export function saudacao(hora: number): string {
  if (hora >= 5 && hora < 12) return 'Bom dia,';
  if (hora >= 12 && hora < 18) return 'Boa tarde,';
  return 'Boa noite,';
}

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const SEMANA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

/** Data ISO (aaaa-mm-dd) → "Hoje", "Ontem" ou "seg, 2 nov". */
export function rotuloDoDia(isoData: string, hoje: Date = new Date()): string {
  const [a, m, d] = isoData.split('-').map(Number);
  const data = new Date(a, m - 1, d);
  const base = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  const diff = Math.round((base.getTime() - data.getTime()) / 86_400_000);
  if (diff === 0) return 'Hoje';
  if (diff === 1) return 'Ontem';
  return `${SEMANA[data.getDay()]}, ${d} ${MESES[m - 1]}`;
}

/** Instante ISO → "15:40" no horário do celular. */
export function horaCurta(isoInstante: string): string {
  const d = new Date(isoInstante);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/** Letra do dia da semana para o gráfico (0 = domingo). */
export function letraDoDia(isoData: string): string {
  const [a, m, d] = isoData.split('-').map(Number);
  return ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'][new Date(a, m - 1, d).getDay()];
}
