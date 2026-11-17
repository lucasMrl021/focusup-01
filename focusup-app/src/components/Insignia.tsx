import React from 'react';
import { Pressable, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import type { Conquista } from '../api/types';
import { useTema } from '../theme/ThemeProvider';
import { fontes } from '../theme/tokens';
import { Icone } from './Icone';
import { ICONES, NomeIcone } from './icones';
import { Texto } from './Texto';

type Props = { conquista: Pick<Conquista, 'nome' | 'icone' | 'tom' | 'conquistada' | 'dica'>; tamanho?: number; onPress?: () => void };

/** Insígnia: disco colorido, doze pontos, anel interno e ícone (RF06). Bloqueada fica cinza com cadeado. */
export function Insignia({ conquista, tamanho = 88, onPress }: Props) {
  const { c } = useTema();
  const bloqueada = !conquista.conquistada;
  const [fundo, tinta] = bloqueada
    ? [c.superficieFunda, c.tintaSuave]
    : {
        foco: [c.foco, c.sobreFoco],
        chama: [c.chama, c.sobreChama],
        pontos: [c.pontos, c.sobrePontos],
        palco: [c.palco, c.pontos],
      }[conquista.tom];
  const icone: NomeIcone = bloqueada ? 'cadeado' : conquista.icone in ICONES ? (conquista.icone as NomeIcone) : 'conquista';
  const pontos = Array.from({ length: 12 }, (_, i) => {
    const a = ((i * 30 - 90) * Math.PI) / 180;
    return { x: 48 + 40 * Math.cos(a), y: 48 + 40 * Math.sin(a) };
  });
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={`${conquista.nome}${bloqueada ? ', bloqueada' : ''}`}
      style={{ width: tamanho + 16, alignItems: 'center', gap: 8 }}
    >
      <View style={{ width: tamanho, height: tamanho, borderRadius: tamanho / 2, backgroundColor: fundo, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={tamanho} height={tamanho} viewBox="0 0 96 96" style={{ position: 'absolute' }}>
          {pontos.map((p, i) => (
            <Circle key={i} cx={p.x} cy={p.y} r={2} fill={tinta} opacity={0.4} />
          ))}
          <Circle cx={48} cy={48} r={32} stroke={tinta} strokeWidth={3} fill="none" opacity={0.4} />
        </Svg>
        <Icone nome={icone} cor={tinta} tamanho={tamanho * 0.36} traco={2.4} />
      </View>
      <Texto estilo="legenda" style={{ fontFamily: fontes.texto600, textAlign: 'center' }}>
        {conquista.nome}
      </Texto>
      {bloqueada && (
        <Texto estilo="legenda" cor={c.tintaSuave} style={{ fontSize: 12, lineHeight: 16, textAlign: 'center' }}>
          {conquista.dica}
        </Texto>
      )}
    </Pressable>
  );
}
