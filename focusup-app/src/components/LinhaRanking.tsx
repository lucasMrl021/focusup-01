import React from 'react';
import { View } from 'react-native';
import type { ItemRanking } from '../api/types';
import { formatarPontos } from '../domain/format';
import { useTema } from '../theme/ThemeProvider';
import { espaco, fontes, raio } from '../theme/tokens';
import { Avatar } from './Avatar';
import { Icone } from './Icone';
import { Texto } from './Texto';

/** Linha do ranking (6.1). A do usuário fica destacada e diz "(você)". */
export function LinhaRanking({ item }: { item: ItemRanking }) {
  const { c } = useTema();
  return (
    <View
      accessible
      accessibilityLabel={`${item.posicao}º lugar, ${item.apelido}${item.voce ? ', você' : ''}, ${item.pontos} pontos, ${item.sequencia} dias seguidos`}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: espaco[3],
        paddingVertical: espaco[3],
        paddingHorizontal: espaco[4],
        borderRadius: raio.lg,
        borderWidth: 1,
        backgroundColor: item.voce ? c.focoSuave : c.superficie,
        borderColor: item.voce ? c.foco : c.linha,
      }}
    >
      <Texto estilo="numero" cor={item.voce ? c.foco : c.tintaSuave} style={{ fontSize: 16, lineHeight: 20, width: 32 }}>
        {item.posicao}º
      </Texto>
      <Avatar nome={item.apelido} foto={item.foto} destaque={item.voce} />
      <Texto numberOfLines={1} style={{ flex: 1, fontFamily: fontes.texto600, fontSize: 15 }}>
        {item.apelido}
        {item.voce && (
          <Texto cor={c.tintaSuave} style={{ fontSize: 15 }}>
            {' (você)'}
          </Texto>
        )}
      </Texto>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
        <Icone nome="sequencia" cor={c.chamaTexto} tamanho={16} />
        <Texto estilo="legenda" cor={c.chamaTexto} style={{ fontFamily: fontes.texto600 }}>
          {item.sequencia}
        </Texto>
      </View>
      <Texto estilo="legenda" cor={c.pontosTexto} style={{ fontFamily: fontes.texto600, fontSize: 14, fontVariant: ['tabular-nums'] }}>
        {formatarPontos(item.pontos)} pts
      </Texto>
    </View>
  );
}
