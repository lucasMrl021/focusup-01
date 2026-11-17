import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { useTema } from '../theme/ThemeProvider';
import { espaco, raio } from '../theme/tokens';
import { Icone } from './Icone';
import { NomeIcone } from './icones';
import { Texto } from './Texto';

type Props = {
  children: string;
  onPress?: () => void;
  variante?: 'primario' | 'secundario' | 'texto';
  grande?: boolean;
  bloco?: boolean;
  icone?: NomeIcone;
  carregando?: boolean;
  desabilitado?: boolean;
  testID?: string;
};

/** Botão do design system. Um primário por tela. */
export function Botao({ children, onPress, variante = 'primario', grande, bloco, icone, carregando, desabilitado, testID }: Props) {
  const { c } = useTema();
  const inativo = desabilitado || carregando;
  const fundo = variante === 'primario' ? c.foco : variante === 'secundario' ? c.superficie : 'transparent';
  const corTexto = variante === 'primario' ? c.sobreFoco : variante === 'secundario' ? c.tinta : c.foco;
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!inativo, busy: !!carregando }}
      disabled={inativo}
      onPress={onPress}
      style={({ pressed }) => [
        estilos.base,
        {
          backgroundColor: fundo,
          borderColor: variante === 'secundario' ? c.linhaForte : 'transparent',
          minHeight: grande ? 56 : 48,
          borderRadius: grande ? raio.lg : raio.md,
          paddingHorizontal: variante === 'texto' ? espaco[3] : espaco[6],
          alignSelf: bloco ? 'stretch' : 'flex-start',
          opacity: desabilitado ? 0.45 : 1,
          transform: [{ scale: pressed && !inativo ? 0.97 : 1 }],
        },
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={corTexto} />
      ) : (
        <View style={estilos.conteudo}>
          {icone && <Icone nome={icone} cor={corTexto} tamanho={20} />}
          <Texto estilo="rotulo" cor={corTexto} style={grande && { fontSize: 17 }}>
            {children}
          </Texto>
        </View>
      )}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  conteudo: { flexDirection: 'row', alignItems: 'center', gap: espaco[2] },
});
