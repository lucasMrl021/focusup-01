import React from 'react';
import { View } from 'react-native';
import type { Meta } from '../api/types';
import { formatarMinutos } from '../domain/format';
import { useTema } from '../theme/ThemeProvider';
import { fontes } from '../theme/tokens';
import { BarraProgresso } from './BarraProgresso';
import { Cartao } from './Cartao';
import { Selo } from './Selo';
import { Texto } from './Texto';

/** Cartão de meta (2.1, 3.1). Meta não cumprida mostra só quanto falta, sem cor de erro. */
export function CartaoMeta({ meta, onPress }: { meta: Meta; onPress?: () => void }) {
  const { c } = useTema();
  const semanal = meta.tipo === 'SEMANAL';
  const falta = meta.minutosAlvo - meta.minutosFeitos;
  return (
    <Cartao onPress={onPress} rotulo={`Meta ${semanal ? 'semanal' : 'de hoje'}`}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <View style={{ flexShrink: 1 }}>
          <Texto estilo="sobrelinha" cor={c.tintaSuave}>
            {semanal ? 'Meta semanal' : 'Meta de hoje'}
          </Texto>
          <Texto estilo="subtitulo">
            {formatarMinutos(meta.minutosAlvo)} {semanal ? 'por semana' : 'por dia'}
          </Texto>
        </View>
        {meta.cumprida && (
          <Selo tom="foco" icone="metas">
            Meta cumprida
          </Selo>
        )}
      </View>
      <BarraProgresso valor={meta.minutosFeitos} max={meta.minutosAlvo} rotulo="Progresso da meta" />
      <Texto estilo="legenda" cor={c.tintaSuave} style={{ fontSize: 14 }}>
        <Texto estilo="legenda" style={{ fontSize: 14, fontFamily: fontes.texto600 }}>
          {formatarMinutos(meta.minutosFeitos)}
        </Texto>
        {` de ${formatarMinutos(meta.minutosAlvo)} · ${meta.cumprida ? 'você chegou lá' : `faltam ${formatarMinutos(falta)}`}`}
      </Texto>
    </Cartao>
  );
}
