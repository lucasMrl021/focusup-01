import React from 'react';
import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import * as svgs from '../assets/svgs';
import { useTema } from '../theme/ThemeProvider';
import { raio } from '../theme/tokens';

type Nome = 'boasVindas' | 'metasVazio' | 'recomeceHoje' | 'sessaoConcluida';

/** Ilustrações planas da marca. No tema escuro ficam sobre um cartão claro para manter as cores. */
export function Ilustracao({ nome, largura = 280, rotulo }: { nome: Nome; largura?: number; rotulo?: string }) {
  const { escuro } = useTema();
  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={rotulo}
      style={{ alignSelf: 'center', borderRadius: raio.lg, overflow: 'hidden', backgroundColor: escuro ? '#F2F6F5' : 'transparent' }}
    >
      <SvgXml xml={svgs[nome]} width={largura} height={(largura * 240) / 320} />
    </View>
  );
}

export function Logotipo({ altura = 40 }: { altura?: number }) {
  const { escuro } = useTema();
  return (
    <View accessibilityRole="image" accessibilityLabel="FocusUp">
      <SvgXml xml={escuro ? svgs.logotipoEscuro : svgs.logotipo} height={altura} width={(altura * 238) / 74} />
    </View>
  );
}
