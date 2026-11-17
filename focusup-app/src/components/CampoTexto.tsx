import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { useTema } from '../theme/ThemeProvider';
import { espaco, fontes, raio } from '../theme/tokens';
import { Icone } from './Icone';
import { Texto } from './Texto';

type Props = Omit<TextInputProps, 'style'> & { rotulo: string; erro?: string | null; dica?: string; senha?: boolean };

/** Campo com rótulo acima e mensagem abaixo; senha com botão de mostrar e ocultar. */
export function CampoTexto({ rotulo, erro, dica, senha, ...props }: Props) {
  const { c } = useTema();
  const [mostrar, setMostrar] = useState(false);
  const [focado, setFocado] = useState(false);
  const borda = erro ? c.alerta : focado ? c.foco : c.linhaForte;
  return (
    <View style={{ gap: 6 }}>
      <Texto estilo="rotulo" style={{ fontSize: 14 }}>
        {rotulo}
      </Texto>
      <View style={estilos.caixa}>
        <TextInput
          {...props}
          accessibilityLabel={rotulo}
          secureTextEntry={senha && !mostrar}
          placeholderTextColor={c.tintaSuave}
          onFocus={(e) => {
            setFocado(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocado(false);
            props.onBlur?.(e);
          }}
          style={[
            estilos.input,
            { borderColor: borda, backgroundColor: c.superficie, color: c.tinta, paddingRight: senha ? 52 : espaco[4] },
          ]}
        />
        {senha && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={mostrar ? 'Ocultar senha' : 'Mostrar senha'}
            onPress={() => setMostrar((m) => !m)}
            style={estilos.olho}
            hitSlop={8}
          >
            <Icone nome="olho" cor={mostrar ? c.foco : c.tintaSuave} tamanho={20} />
          </Pressable>
        )}
      </View>
      {(erro || dica) && (
        <Texto estilo="legenda" cor={erro ? c.alerta : c.tintaSuave} style={erro ? { fontFamily: fontes.texto500 } : undefined}>
          {erro || dica}
        </Texto>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  caixa: { flexDirection: 'row' },
  input: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: espaco[4],
    borderWidth: 2,
    borderRadius: raio.md,
    fontFamily: fontes.texto400,
    fontSize: 16,
  },
  olho: { position: 'absolute', right: 6, top: 6, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
});
