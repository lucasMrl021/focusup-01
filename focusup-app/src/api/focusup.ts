import { requisicao } from './client';
import type {
  AuthResposta,
  Conquistas,
  Estatisticas,
  Inicio,
  ItemRanking,
  Meta,
  Perfil,
  ResultadoSessao,
  Sessao,
  TipoMeta,
  UsuarioBusca,
} from './types';

/** Todas as chamadas que o app faz à API do FocusUp. */
export const api = {
  cadastrar: (nome: string, email: string, senha: string) =>
    requisicao<AuthResposta>('POST', '/api/auth/cadastro', { nome, email, senha }),
  entrar: (email: string, senha: string) => requisicao<AuthResposta>('POST', '/api/auth/login', { email, senha }),

  perfil: () => requisicao<Perfil>('GET', '/api/perfil'),
  atualizarPerfil: (dados: { apelido: string; idade: number | null; serie: string | null; foto?: string | null }) =>
    requisicao<Perfil>('PUT', '/api/perfil', dados),

  inicio: () => requisicao<Inicio>('GET', '/api/inicio'),

  metas: () => requisicao<Meta[]>('GET', '/api/metas'),
  criarMeta: (tipo: TipoMeta, minutosAlvo: number) => requisicao<Meta>('POST', '/api/metas', { tipo, minutosAlvo }),
  atualizarMeta: (id: number, tipo: TipoMeta, minutosAlvo: number) =>
    requisicao<Meta>('PUT', `/api/metas/${id}`, { tipo, minutosAlvo }),
  excluirMeta: (id: number) => requisicao<void>('DELETE', `/api/metas/${id}`),

  iniciarSessao: (duracaoMinutos: number) => requisicao<Sessao>('POST', '/api/sessoes', { duracaoMinutos }),
  concluirSessao: (id: number) => requisicao<ResultadoSessao>('POST', `/api/sessoes/${id}/concluir`),
  encerrarSessao: (id: number) => requisicao<void>('POST', `/api/sessoes/${id}/encerrar`),
  historico: (limite = 100) => requisicao<Sessao[]>('GET', `/api/sessoes?limite=${limite}`),

  estatisticas: (periodo: 'SEMANA' | 'MES') => requisicao<Estatisticas>('GET', `/api/estatisticas?periodo=${periodo}`),
  conquistas: () => requisicao<Conquistas>('GET', '/api/conquistas'),

  ranking: () => requisicao<ItemRanking[]>('GET', '/api/ranking'),
  buscarUsuarios: (q: string) => requisicao<UsuarioBusca[]>('GET', `/api/amigos/busca?q=${encodeURIComponent(q)}`),
  adicionarAmigo: (id: number) => requisicao<void>('POST', `/api/amigos/${id}`),
};
