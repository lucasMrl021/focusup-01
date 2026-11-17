import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const CHAVE = 'focusup.token';

/** Guarda o token com segurança no celular (no navegador, usa localStorage). */
export const armazenamento = {
  async ler(): Promise<string | null> {
    if (Platform.OS === 'web') return globalThis.localStorage?.getItem(CHAVE) ?? null;
    return SecureStore.getItemAsync(CHAVE);
  },
  async salvar(token: string): Promise<void> {
    if (Platform.OS === 'web') {
      globalThis.localStorage?.setItem(CHAVE, token);
      return;
    }
    await SecureStore.setItemAsync(CHAVE, token);
  },
  async apagar(): Promise<void> {
    if (Platform.OS === 'web') {
      globalThis.localStorage?.removeItem(CHAVE);
      return;
    }
    await SecureStore.deleteItemAsync(CHAVE);
  },
};
