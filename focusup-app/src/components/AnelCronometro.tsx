import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { formatarRelogio } from '../domain/format';
import { useTema } from '../theme/ThemeProvider';
import { Texto } from './Texto';

type Props = { total: number; restante: number; legenda?: string; tamanho?: number };

/** Anel do cronômetro regressivo (tela 4.2); é o mesmo anel do símbolo da marca. */
export function AnelCronometro({ total, restante, legenda, tamanho = 260 }: Props) {
  const { c } = useTema();
  const r = 112;
  const circ = 2 * Math.PI * r;
  const fracao = total > 0 ? Math.max(0, Math.min(1, restante / total)) : 0;
  const minutos = Math.floor(restante / 60);
  return (
    <View
      accessibilityRole="timer"
      accessibilityLabel={`${minutos} minutos e ${restante % 60} segundos restantes`}
      style={{ width: tamanho, height: tamanho, alignItems: 'center', justifyContent: 'center' }}
    >
      <Svg width={tamanho} height={tamanho} viewBox="0 0 256 256" style={StyleSheet.absoluteFill}>
        <Circle cx={128} cy={128} r={r} stroke={c.superficieFunda} strokeWidth={16} fill="none" />
        <Circle
          cx={128}
          cy={128}
          r={r}
          stroke={c.foco}
          strokeWidth={16}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circ} ${circ}`}
          strokeDashoffset={circ * (1 - fracao)}
          transform="rotate(-90 128 128)"
        />
      </Svg>
      <Texto estilo="cronometro" style={{ fontVariant: ['tabular-nums'] }}>
        {formatarRelogio(restante)}
      </Texto>
      {legenda && (
        <Texto estilo="legenda" cor={c.tintaSuave}>
          {legenda}
        </Texto>
      )}
    </View>
  );
}
