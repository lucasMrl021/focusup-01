import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { Meta, ResultadoSessao, Sessao } from '../api/types';

export type AbaProgresso = 'estatisticas' | 'historico' | 'conquistas';

/** Telas de quem não entrou (1.1, 1.2, 1.3). */
export type AcessoParams = {
  BoasVindas: undefined;
  Cadastro: undefined;
  Login: undefined;
};

/** As cinco abas da área logada. */
export type AbasParams = {
  Inicio: undefined;
  Metas: undefined;
  Foco: undefined;
  Progresso: { aba?: AbaProgresso } | undefined;
  Ranking: undefined;
};

/** Pilha da área logada: as abas e as telas que abrem por cima delas. */
export type AppParams = {
  Abas: NavigatorScreenParams<AbasParams>;
  MetaForm: { meta?: Meta } | undefined;
  SessaoAtiva: { sessao: Sessao };
  SessaoConcluida: { resultado: ResultadoSessao };
  AdicionarAmigo: undefined;
  Perfil: undefined;
  EditarPerfil: undefined;
};

export type AcessoProps<T extends keyof AcessoParams> = NativeStackScreenProps<AcessoParams, T>;
export type AppProps<T extends keyof AppParams> = NativeStackScreenProps<AppParams, T>;
export type AbaProps<T extends keyof AbasParams> = CompositeScreenProps<
  BottomTabScreenProps<AbasParams, T>,
  NativeStackScreenProps<AppParams>
>;
