import React from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTema } from '../theme/ThemeProvider';
import { espaco } from '../theme/tokens';
import { Texto } from './Texto';

type Props = {
  children: React.ReactNode;
  titulo?: string;
  acaoTopo?: React.ReactNode;
  rolar?: boolean;
  recarregando?: boolean;
  aoRecarregar?: () => void;
  rodape?: React.ReactNode;
};

/** Moldura das telas: fundo, área segura, título no topo e rolagem. */
export function Tela({ children, titulo, acaoTopo, rolar = true, recarregando, aoRecarregar, rodape }: Props) {
  const { c } = useTema();
  const topo = (titulo || acaoTopo) && (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: espaco[3] }}>
      {titulo ? (
        <Texto estilo="titulo" accessibilityRole="header" style={{ flexShrink: 1 }}>
          {titulo}
        </Texto>
      ) : (
        <View />
      )}
      {acaoTopo}
    </View>
  );
  const conteudo = (
    <View style={{ gap: espaco[4], paddingHorizontal: espaco[4], paddingTop: espaco[4], paddingBottom: espaco[6] }}>
      {topo}
      {children}
    </View>
  );
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: c.fundo }}>
      {rolar ? (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          refreshControl={aoRecarregar ? <RefreshControl refreshing={!!recarregando} onRefresh={aoRecarregar} tintColor={c.foco} /> : undefined}
        >
          {conteudo}
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>{conteudo}</View>
      )}
      {rodape && <View style={{ padding: espaco[4], gap: espaco[3] }}>{rodape}</View>}
    </SafeAreaView>
  );
}
