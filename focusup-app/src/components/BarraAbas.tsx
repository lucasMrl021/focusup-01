import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTema } from '../theme/ThemeProvider';
import { espaco, fontes, raio } from '../theme/tokens';
import { Icone } from './Icone';
import { NomeIcone } from './icones';
import { Texto } from './Texto';

const ABAS: Record<string, { icone: NomeIcone; rotulo: string }> = {
  Inicio: { icone: 'inicio', rotulo: 'Início' },
  Metas: { icone: 'metas', rotulo: 'Metas' },
  Foco: { icone: 'foco', rotulo: 'Foco' },
  Progresso: { icone: 'progresso', rotulo: 'Progresso' },
  Ranking: { icone: 'ranking', rotulo: 'Ranking' },
};

/** Barra de abas do design system: Foco fica no centro, em destaque. */
export function BarraAbas({ state, navigation }: BottomTabBarProps) {
  const { c } = useTema();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingTop: espaco[2],
        paddingBottom: Math.max(insets.bottom, espaco[3]),
        paddingHorizontal: espaco[2],
        backgroundColor: c.superficie,
        borderTopWidth: 1,
        borderTopColor: c.linha,
      }}
    >
      {state.routes.map((rota, i) => {
        const ativa = state.index === i;
        const aba = ABAS[rota.name];
        const foco = rota.name === 'Foco';
        const cor = foco ? c.sobreFoco : ativa ? c.foco : c.tintaSuave;
        return (
          <Pressable
            key={rota.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: ativa }}
            accessibilityLabel={aba.rotulo}
            onPress={() => {
              const evento = navigation.emit({ type: 'tabPress', target: rota.key, canPreventDefault: true });
              if (!ativa && !evento.defaultPrevented) navigation.navigate(rota.name);
            }}
            style={{ flex: 1, alignItems: 'center', gap: 2 }}
          >
            <View
              style={
                foco
                  ? { width: 56, height: 56, marginTop: -24, borderRadius: raio.total, backgroundColor: c.foco, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: c.superficie }
                  : { width: 48, height: 32, borderRadius: raio.total, alignItems: 'center', justifyContent: 'center', backgroundColor: ativa ? c.focoSuave : 'transparent' }
              }
            >
              <Icone nome={aba.icone} cor={cor} tamanho={foco ? 26 : 24} />
            </View>
            <Texto
              estilo="legenda"
              cor={ativa ? c.foco : c.tintaSuave}
              style={{ fontSize: 12, lineHeight: 16, fontFamily: ativa ? fontes.texto700 : fontes.texto500 }}
            >
              {aba.rotulo}
            </Texto>
          </Pressable>
        );
      })}
    </View>
  );
}
