import { Lexend_400Regular, Lexend_500Medium, Lexend_600SemiBold, Lexend_700Bold } from '@expo-google-fonts/lexend';
import { Unbounded_600SemiBold, Unbounded_700Bold } from '@expo-google-fonts/unbounded';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/auth/AuthContext';
import { Navegacao } from './src/navigation/Navegacao';
import { ThemeProvider } from './src/theme/ThemeProvider';

export default function App() {
  const [fontesProntas] = useFonts({
    Unbounded_600SemiBold,
    Unbounded_700Bold,
    Lexend_400Regular,
    Lexend_500Medium,
    Lexend_600SemiBold,
    Lexend_700Bold,
  });
  if (!fontesProntas) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <StatusBar style="auto" />
          <Navegacao />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
