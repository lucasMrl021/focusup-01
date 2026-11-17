import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ICONES, NomeIcone } from './icones';

type Props = { nome: NomeIcone; cor: string; tamanho?: number; traco?: number; rotulo?: string };

/** Ícone de traço do FocusUp. Sem `rotulo`, fica escondido dos leitores de tela. */
export function Icone({ nome, cor, tamanho = 24, traco = 2, rotulo }: Props) {
  return (
    <Svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      accessibilityLabel={rotulo}
      accessibilityElementsHidden={!rotulo}
      importantForAccessibility={rotulo ? 'yes' : 'no-hide-descendants'}
    >
      <Path d={ICONES[nome]} stroke={cor} strokeWidth={traco} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
