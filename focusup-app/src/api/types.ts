/** Tipos das respostas da API (espelham web/dto/Dtos.java). */

export type TipoMeta = 'DIARIA' | 'SEMANAL';

export interface Nivel {
  nivel: number;
  pontos: number;
  base: number;
  proximo: number;
}

export interface Sequencia {
  atual: number;
  melhor: number;
  semana: boolean[];
  hoje: number;
}

export interface Perfil {
  id: number;
  nome: string;
  email: string;
  apelido: string;
  idade: number | null;
  serie: string | null;
  foto: string | null;
  pontos: number;
  nivel: Nivel;
  sequenciaAtual: number;
}

export interface AuthResposta {
  token: string;
  usuario: Perfil;
}

export interface Meta {
  id: number;
  tipo: TipoMeta;
  minutosAlvo: number;
  minutosFeitos: number;
  cumprida: boolean;
}

export interface Sessao {
  id: number;
  duracaoMinutos: number;
  status: 'EM_ANDAMENTO' | 'CONCLUIDA' | 'ENCERRADA';
  inicio: string;
  fim: string | null;
  dia: string | null;
  pontos: number;
}

export interface Conquista {
  codigo: string;
  nome: string;
  descricao: string;
  dica: string;
  icone: string;
  tom: 'foco' | 'chama' | 'pontos' | 'palco';
  conquistada: boolean;
  conquistadaEm: string | null;
}

export interface ResultadoSessao {
  sessao: Sessao;
  pontosGanhos: number;
  bonusConstancia: number;
  nivel: Nivel;
  subiuDeNivel: boolean;
  sequencia: Sequencia;
  metaHoje: Meta | null;
  novasConquistas: Conquista[];
}

export interface Inicio {
  apelido: string;
  foto: string | null;
  nivel: Nivel;
  sequencia: Sequencia;
  metaHoje: Meta | null;
  ultimasSessoes: Sessao[];
}

export interface Conquistas {
  nivel: Nivel;
  sequencia: Sequencia;
  conquistas: Conquista[];
}

export interface Estatisticas {
  periodo: 'SEMANA' | 'MES';
  totalMinutos: number;
  totalSessoes: number;
  metaDiariaMinutos: number | null;
  dias: { data: string; minutos: number }[];
}

export interface ItemRanking {
  posicao: number;
  usuarioId: number;
  apelido: string;
  foto: string | null;
  pontos: number;
  nivel: number;
  sequencia: number;
  voce: boolean;
}

export interface UsuarioBusca {
  id: number;
  apelido: string;
  foto: string | null;
  nivel: number;
  jaAmigo: boolean;
}
