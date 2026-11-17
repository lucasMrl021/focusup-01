import React from 'react';
import { View } from 'react-native';
import { useTema } from '../theme/ThemeProvider';
import { raio } from '../theme/tokens';

type Props = { valor: number; max: number; tom?: 'foco' | 'chama' | 'pontos'; rotulo?: string };

/** Barra de 12 px. Tom "pontos" só dentro do cartão palco. */
export function BarraProgresso({ valor, max, tom = 'foco', rotulo }: Props) {
  const { c } = useTema();
  const pct = max > 0 ? Math.max(0, Math.min(100, (100 * valor) / max)) : 0;
  const trilho = tom === 'pontos' ? c.palcoTrilho : c.superficieFunda;
  const cor = tom === 'pontos' ? c.pontos : tom === 'chama' ? c.chama : c.foco;
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={rotulo}
      accessibilityValue={{ min: 0, max, now: Math.min(valor, max) }}
      style={{ height: 12, borderRadius: raio.sm, backgroundColor: trilho, overflow: 'hidden' }}
    >
      <View testID="barra-preenchimento" style={{ width: `${pct}%`, height: '100%', borderRadius: raio.sm, backgroundColor: cor }} />
    </View>
  );
}
