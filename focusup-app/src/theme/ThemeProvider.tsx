import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { cores, Cores } from './tokens';

type Tema = { c: Cores; escuro: boolean };

const TemaContext = createContext<Tema>({ c: cores.claro, escuro: false });

/** Segue o tema claro/escuro do celular. */
export function ThemeProvider({ children, forcar }: { children: React.ReactNode; forcar?: 'claro' | 'escuro' }) {
  const sistema = useColorScheme();
  const escuro = forcar ? forcar === 'escuro' : sistema === 'dark';
  return <TemaContext.Provider value={{ c: escuro ? cores.escuro : cores.claro, escuro }}>{children}</TemaContext.Provider>;
}

export function useTema(): Tema {
  return useContext(TemaContext);
}
