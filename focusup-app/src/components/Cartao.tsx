import React from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { useTema } from '../theme/ThemeProvider';
import { espaco, raio } from '../theme/tokens';

type Props = { children: React.ReactNode; palco?: boolean; onPress?: () => void; style?: StyleProp<ViewStyle>; rotulo?: string };

/** Cartão claro (superfície) ou de destaque (palco). */
export function Cartao({ children, palco, onPress, style, rotulo }: Props) {
  const { c, escuro } = useTema();
  const base: ViewStyle = palco
    ? { backgroundColor: c.palco, borderRadius: raio.xl, padding: espaco[4], gap: espaco[3] }
    : {
        backgroundColor: c.superficie,
        borderRadius: raio.lg,
        padding: espaco[4],
        gap: espaco[3],
        borderWidth: 1,
        borderColor: c.linha,
        ...(escuro
          ? {}
          : { shadowColor: '#10262B', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 1 }),
      };
  if (onPress) {
    return (
      <Pressable accessibilityRole="button" accessibilityLabel={rotulo} onPress={onPress} style={({ pressed }) => [base, pressed && { opacity: 0.85 }, style]}>
        {children}
      </Pressable>
    );
  }
  return <View style={[base, style]}>{children}</View>;
}
