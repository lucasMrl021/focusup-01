import React from 'react';
import { View } from 'react-native';
import { useTema } from '../theme/ThemeProvider';
import { fontes, raio } from '../theme/tokens';
import { Icone } from './Icone';
import { NomeIcone } from './icones';
import { Texto } from './Texto';

type Props = { children: React.ReactNode; tom?: 'neutro' | 'foco' | 'chama' | 'pontos'; icone?: NomeIcone };

/** Pílula curta: "Meta cumprida", "+25 pontos". */
export function Selo({ children, tom = 'neutro', icone }: Props) {
  const { c } = useTema();
  const [fundo, cor] = {
    neutro: [c.superficieFunda, c.tinta],
    foco: [c.focoSuave, c.foco],
    chama: [c.chamaSuave, c.chamaTexto],
    pontos: [c.pontosSuave, c.pontosTexto],
  }[tom];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4, paddingHorizontal: 10, borderRadius: raio.total, backgroundColor: fundo, alignSelf: 'flex-start' }}>
      {icone && <Icone nome={icone} cor={cor} tamanho={14} traco={2.4} />}
      <Texto estilo="legenda" cor={cor} style={{ fontFamily: fontes.texto600 }}>
        {children}
      </Texto>
    </View>
  );
}
