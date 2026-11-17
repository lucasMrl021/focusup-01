import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Endereço da API Spring Boot.
 * 1. Se existir EXPO_PUBLIC_API_URL (arquivo .env), usa ele.
 * 2. No Expo Go, usa o IP do computador que roda o "expo start", na porta 8080.
 * 3. No emulador Android sem Expo Go, 10.0.2.2 aponta para o computador.
 */
export function urlDaApi(): string {
  const env = process.env.EXPO_PUBLIC_API_URL;
  if (env) return env.replace(/\/$/, '');

  const hostUri = Constants.expoConfig?.hostUri; // ex.: "192.168.0.12:8081"
  const host = hostUri?.split(':')[0];
  if (host) return `http://${host}:8080`;

  return Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';
}
