import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { aoSessaoExpirar, definirToken } from '../api/client';
import { api } from '../api/focusup';
import { armazenamento } from './storage';

type Auth = {
  carregando: boolean;
  logado: boolean;
  entrar: (email: string, senha: string) => Promise<void>;
  cadastrar: (nome: string, email: string, senha: string) => Promise<void>;
  sair: () => Promise<void>;
};

const AuthContext = createContext<Auth | null>(null);

/** Login, cadastro e logout (RF01). Com login ativo, o app abre direto em Início. */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  const aplicar = useCallback(async (novo: string | null) => {
    definirToken(novo);
    setToken(novo);
    if (novo) await armazenamento.salvar(novo);
    else await armazenamento.apagar();
  }, []);

  useEffect(() => {
    armazenamento
      .ler()
      .then((salvo) => {
        definirToken(salvo);
        setToken(salvo);
      })
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => {
    aoSessaoExpirar(() => {
      void aplicar(null);
    });
    return () => aoSessaoExpirar(null);
  }, [aplicar]);

  const valor = useMemo<Auth>(
    () => ({
      carregando,
      logado: token !== null,
      entrar: async (email, senha) => {
        const r = await api.entrar(email.trim(), senha);
        await aplicar(r.token);
      },
      cadastrar: async (nome, email, senha) => {
        const r = await api.cadastrar(nome.trim(), email.trim(), senha);
        await aplicar(r.token);
      },
      sair: () => aplicar(null),
    }),
    [carregando, token, aplicar],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth(): Auth {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>');
  return ctx;
}
