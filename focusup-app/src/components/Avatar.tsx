import React from 'react';
import { Image, View } from 'react-native';
import { useTema } from '../theme/ThemeProvider';
import { fontes } from '../theme/tokens';
import { Texto } from './Texto';

export function iniciais(nome: string): string {
  return (
    nome
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0])
      .join('')
      .toUpperCase() || '?'
  );
}

/** Foto em círculo; sem foto, as iniciais do apelido. */
export function Avatar({ nome, foto, tamanho = 40, destaque }: { nome: string; foto?: string | null; tamanho?: number; destaque?: boolean }) {
  const { c } = useTema();
  return (
    <View
      accessibilityLabel={`Foto de ${nome}`}
      style={{
        width: tamanho,
        height: tamanho,
        borderRadius: tamanho / 2,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: destaque ? c.foco : c.focoSuave,
      }}
    >
      {foto ? (
        <Image source={{ uri: foto }} style={{ width: tamanho, height: tamanho }} />
      ) : (
        <Texto style={{ fontFamily: fontes.display600, fontSize: Math.round(tamanho * 0.38), lineHeight: Math.round(tamanho * 0.5) }} cor={destaque ? c.sobreFoco : c.foco}>
          {iniciais(nome)}
        </Texto>
      )}
    </View>
  );
}
