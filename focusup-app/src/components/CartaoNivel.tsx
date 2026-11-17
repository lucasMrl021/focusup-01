import React from 'react';
import { View } from 'react-native';
import type { Nivel } from '../api/types';
import { formatarPontos } from '../domain/format';
import { useTema } from '../theme/ThemeProvider';
import { fontes, raio } from '../theme/tokens';
import { BarraProgresso } from './BarraProgresso';
import { Cartao } from './Cartao';
import { Icone } from './Icone';
import { Texto } from './Texto';

/** Nível, pontos e barra até o próximo nível, no palco escuro (2.1, 4.3, 5.3). */
export function CartaoNivel({ nivel, onPress }: { nivel: Nivel; onPress?: () => void }) {
  const { c } = useTema();
  return (
    <Cartao palco onPress={onPress} rotulo={`Nível ${nivel.nivel}`}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View>
          <Texto estilo="sobrelinha" cor={c.sobrePalcoSuave}>
            Nível
          </Texto>
          <Texto estilo="numero" cor={c.sobrePalco} style={{ fontSize: 40, lineHeight: 46 }}>
            {nivel.nivel}
          </Texto>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, paddingHorizontal: 12, borderRadius: raio.total, backgroundColor: c.pontos }}>
          <Icone nome="pontos" cor={c.sobrePontos} tamanho={18} />
          <Texto estilo="legenda" cor={c.sobrePontos} style={{ fontFamily: fontes.texto600, fontSize: 14 }}>
            {formatarPontos(nivel.pontos)} pts
          </Texto>
        </View>
      </View>
      <BarraProgresso valor={nivel.pontos - nivel.base} max={nivel.proximo - nivel.base} tom="pontos" rotulo="Progresso até o próximo nível" />
      <Texto estilo="legenda" cor={c.sobrePalcoSuave}>
        Faltam {formatarPontos(nivel.proximo - nivel.pontos)} pontos para o nível {nivel.nivel + 1}
      </Texto>
    </Cartao>
  );
}
