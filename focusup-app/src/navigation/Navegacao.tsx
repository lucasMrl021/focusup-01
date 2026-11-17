import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { View } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { BarraAbas } from '../components/BarraAbas';
import { Carregando } from '../components/EstadoVazio';
import { AdicionarAmigoScreen } from '../screens/AdicionarAmigoScreen';
import { BoasVindasScreen } from '../screens/BoasVindasScreen';
import { CadastroScreen } from '../screens/CadastroScreen';
import { DuracaoScreen } from '../screens/DuracaoScreen';
import { EditarPerfilScreen } from '../screens/EditarPerfilScreen';
import { InicioScreen } from '../screens/InicioScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { MetaFormScreen } from '../screens/MetaFormScreen';
import { MetasScreen } from '../screens/MetasScreen';
import { PerfilScreen } from '../screens/PerfilScreen';
import { ProgressoScreen } from '../screens/progresso/ProgressoScreen';
import { RankingScreen } from '../screens/RankingScreen';
import { SessaoAtivaScreen } from '../screens/SessaoAtivaScreen';
import { SessaoConcluidaScreen } from '../screens/SessaoConcluidaScreen';
import { useTema } from '../theme/ThemeProvider';
import { fontes } from '../theme/tokens';
import type { AbasParams, AcessoParams, AppParams } from './tipos';

const Acesso = createNativeStackNavigator<AcessoParams>();
const App = createNativeStackNavigator<AppParams>();
const Abas = createBottomTabNavigator<AbasParams>();

function AreaLogadaAbas() {
  return (
    <Abas.Navigator screenOptions={{ headerShown: false }} tabBar={(props) => <BarraAbas {...props} />}>
      <Abas.Screen name="Inicio" component={InicioScreen} />
      <Abas.Screen name="Metas" component={MetasScreen} />
      <Abas.Screen name="Foco" component={DuracaoScreen} />
      <Abas.Screen name="Progresso" component={ProgressoScreen} />
      <Abas.Screen name="Ranking" component={RankingScreen} />
    </Abas.Navigator>
  );
}

/**
 * Mapa de navegação (Parte 2): pilha de Acesso para quem não entrou;
 * na área logada, barra de abas + telas que abrem por cima. A Sessão ativa (4.2) esconde a barra.
 */
export function Navegacao() {
  const { carregando, logado } = useAuth();
  const { c, escuro } = useTema();

  if (carregando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: c.fundo }}>
        <Carregando />
      </View>
    );
  }

  const base = escuro ? DarkTheme : DefaultTheme;
  const tema = { ...base, colors: { ...base.colors, background: c.fundo, card: c.superficie, text: c.tinta, primary: c.foco, border: c.linha } };
  const cabecalho = {
    headerShadowVisible: false,
    headerStyle: { backgroundColor: c.fundo },
    headerTintColor: c.foco,
    headerTitleStyle: { fontFamily: fontes.texto600, color: c.tinta },
    headerBackTitle: 'Voltar',
  };

  return (
    <NavigationContainer theme={tema}>
      {logado ? (
        <App.Navigator screenOptions={cabecalho}>
          <App.Screen name="Abas" component={AreaLogadaAbas} options={{ headerShown: false }} />
          <App.Screen name="MetaForm" component={MetaFormScreen} options={({ route }) => ({ title: route.params?.meta ? 'Editar meta' : 'Nova meta' })} />
          <App.Screen name="SessaoAtiva" component={SessaoAtivaScreen} options={{ headerShown: false, gestureEnabled: false }} />
          <App.Screen name="SessaoConcluida" component={SessaoConcluidaScreen} options={{ headerShown: false, gestureEnabled: false }} />
          <App.Screen name="AdicionarAmigo" component={AdicionarAmigoScreen} options={{ title: 'Adicionar amigo' }} />
          <App.Screen name="Perfil" component={PerfilScreen} options={{ title: 'Meu perfil' }} />
          <App.Screen name="EditarPerfil" component={EditarPerfilScreen} options={{ title: 'Editar perfil' }} />
        </App.Navigator>
      ) : (
        <Acesso.Navigator screenOptions={cabecalho}>
          <Acesso.Screen name="BoasVindas" component={BoasVindasScreen} options={{ headerShown: false }} />
          <Acesso.Screen name="Cadastro" component={CadastroScreen} options={{ title: '' }} />
          <Acesso.Screen name="Login" component={LoginScreen} options={{ title: '' }} />
        </Acesso.Navigator>
      )}
    </NavigationContainer>
  );
}
