import { urlDaApi } from '../config';

/** Erro vindo da API, com a mensagem pronta para mostrar na tela. */
export class ApiError extends Error {
  constructor(public status: number, mensagem: string) {
    super(mensagem);
    this.name = 'ApiError';
  }
}

let token: string | null = null;
let aoExpirar: (() => void) | null = null;

export function definirToken(novo: string | null) {
  token = novo;
}

/** O AuthContext registra aqui o que fazer quando o token expira (volta para o login). */
export function aoSessaoExpirar(fn: (() => void) | null) {
  aoExpirar = fn;
}

const TEMPO_LIMITE_MS = 10_000;

export async function requisicao<T>(metodo: string, caminho: string, corpo?: unknown): Promise<T> {
  const controle = new AbortController();
  const timer = setTimeout(() => controle.abort(), TEMPO_LIMITE_MS);
  let resposta: Response;
  try {
    resposta = await fetch(`${urlDaApi()}${caminho}`, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
      signal: controle.signal,
    });
  } catch {
    throw new ApiError(0, 'Sem conexão com o servidor. Confira sua internet e tente de novo.');
  } finally {
    clearTimeout(timer);
  }

  const texto = await resposta.text();
  const dados = texto ? safeJson(texto) : undefined;

  if (!resposta.ok) {
    if (resposta.status === 401 && token && aoExpirar) aoExpirar();
    const mensagem = (dados as { mensagem?: string } | undefined)?.mensagem ?? 'Algo deu errado. Tente de novo.';
    throw new ApiError(resposta.status, mensagem);
  }
  return dados as T;
}

function safeJson(texto: string): unknown {
  try {
    return JSON.parse(texto);
  } catch {
    return undefined;
  }
}
