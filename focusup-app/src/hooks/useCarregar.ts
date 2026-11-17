import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useRef, useState } from 'react';
import { ApiError } from '../api/client';

/** Busca dados sempre que a tela ganha foco. Expõe carregando, erro e recarregar. */
export function useCarregar<T>(buscar: () => Promise<T>) {
  const [dados, setDados] = useState<T | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const buscarRef = useRef(buscar);
  buscarRef.current = buscar;

  const recarregar = useCallback(async () => {
    setCarregando(true);
    try {
      setDados(await buscarRef.current());
      setErro(null);
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : 'Algo deu errado. Tente de novo.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void recarregar();
    }, [recarregar]),
  );

  return { dados, erro, carregando, recarregar, setDados };
}
