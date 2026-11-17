import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTema } from '../theme/ThemeProvider';
import { espaco, fontes, raio } from '../theme/tokens';
import { Texto } from './Texto';

type Props<T extends string> = { opcoes: { valor: T; rotulo: string }[]; valor: T; aoMudar: (v: T) => void };

/** Alternador de 2 ou 3 opções em pílula. */
export function Segmentado<T extends string>({ opcoes, valor, aoMudar }: Props<T>) {
  const { c } = useTema();
  return (
    <View accessibilityRole="tablist" style={[estilos.trilho, { backgroundColor: c.superficieFunda }]}>
      {opcoes.map((o) => {
        const ativo = o.valor === valor;
        return (
          <Pressable
            key={o.valor}
            accessibilityRole="tab"
            accessibilityState={{ selected: ativo }}
            onPress={() => aoMudar(o.valor)}
            style={[estilos.opcao, ativo && { backgroundColor: c.superficie }]}
          >
            <Texto
              estilo="legenda"
              cor={ativo ? c.tinta : c.tintaSuave}
              style={{ fontSize: 14, fontFamily: ativo ? fontes.texto600 : fontes.texto500 }}
            >
              {o.rotulo}
            </Texto>
          </Pressable>
        );
      })}
    </View>
  );
}

const estilos = StyleSheet.create({
  trilho: { flexDirection: 'row', padding: 4, gap: 4, borderRadius: raio.total, alignSelf: 'stretch' },
  opcao: { flex: 1, minHeight: 36, alignItems: 'center', justifyContent: 'center', borderRadius: raio.total, paddingHorizontal: espaco[3] },
});
