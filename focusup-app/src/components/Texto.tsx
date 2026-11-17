import React from 'react';
import { Text, TextProps } from 'react-native';
import { useTema } from '../theme/ThemeProvider';
import { tipo } from '../theme/tokens';

type Estilo = keyof typeof tipo;

/** Texto com os estilos da escala tipográfica. Cor padrão: tinta. */
export function Texto({ estilo = 'corpo', cor, style, ...props }: TextProps & { estilo?: Estilo; cor?: string }) {
  const { c } = useTema();
  const t = tipo[estilo];
  return (
    <Text
      {...props}
      style={[t, { color: cor ?? c.tinta }, estilo === 'sobrelinha' && { textTransform: 'uppercase' }, style]}
    />
  );
}
