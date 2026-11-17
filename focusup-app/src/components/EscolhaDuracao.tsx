import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTema } from '../theme/ThemeProvider';
import { espaco, fontes, raio } from '../theme/tokens';
import { Icone } from './Icone';
import { Texto } from './Texto';

export const DURACOES = [15, 25, 45, 60] as const;

type Props = { valor: number; aoMudar: (m: number) => void; pontos?: number };

/** Cartões de 15, 25, 45 e 60 min (tela 4.1). */
export function EscolhaDuracao({ valor, aoMudar, pontos = 25 }: Props) {
  const { c } = useTema();
  return (
    <View style={{ gap: espaco[3] }}>
      <View accessibilityRole="radiogroup" style={estilos.grade}>
        {DURACOES.map((m) => {
          const ativo = m === valor;
          return (
            <Pressable
              key={m}
              testID={`duracao-${m}`}
              accessibilityRole="radio"
              accessibilityState={{ checked: ativo }}
              accessibilityLabel={`${m} minutos`}
              onPress={() => aoMudar(m)}
              style={[
                estilos.cartao,
                { borderColor: ativo ? c.foco : c.linha, backgroundColor: ativo ? c.focoSuave : c.superficie },
              ]}
            >
              <Texto estilo="numero" cor={ativo ? c.foco : c.tinta} style={{ fontSize: 32, lineHeight: 38 }}>
                {m}
              </Texto>
              <Texto estilo="legenda" cor={ativo ? c.foco : c.tinta} style={{ fontFamily: fontes.texto500, fontSize: 14 }}>
                min
              </Texto>
            </Pressable>
          );
        })}
      </View>
      <View style={[estilos.pontos, { backgroundColor: c.chamaSuave }]}>
        <Icone nome="pontos" cor={c.chamaTexto} tamanho={16} />
        <Texto estilo="legenda" cor={c.chamaTexto} style={{ fontFamily: fontes.texto600, fontSize: 14 }}>
          +{pontos} pontos ao concluir
        </Texto>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  grade: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco[3] },
  cartao: { flexBasis: '47%', flexGrow: 1, padding: espaco[4], borderWidth: 2, borderRadius: raio.lg },
  pontos: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingVertical: 6, paddingHorizontal: 12, borderRadius: raio.total },
});
