import React from 'react';
import { View } from 'react-native';
import { Botao } from '../components/Botao';
import { Ilustracao, Logotipo } from '../components/Ilustracao';
import { Tela } from '../components/Tela';
import { Texto } from '../components/Texto';
import type { AcessoProps } from '../navigation/tipos';
import { useTema } from '../theme/ThemeProvider';
import { espaco } from '../theme/tokens';

/** 1.1 Boas-vindas */
export function BoasVindasScreen({ navigation }: AcessoProps<'BoasVindas'>) {
  const { c } = useTema();
  return (
    <Tela
      rodape={
        <>
          <Botao grande bloco onPress={() => navigation.navigate('Cadastro')}>
            Criar conta
          </Botao>
          <Botao grande bloco variante="secundario" onPress={() => navigation.navigate('Login')}>
            Já tenho conta
          </Botao>
        </>
      }
    >
      <View style={{ alignItems: 'center', gap: espaco[6], paddingTop: espaco[6] }}>
        <Logotipo altura={44} />
        <Ilustracao nome="boasVindas" largura={300} rotulo="Livros, celular virado para baixo e um anel de foco nascendo como um sol" />
        <View style={{ gap: espaco[2] }}>
          <Texto estilo="tituloGrande" accessibilityRole="header" style={{ textAlign: 'center' }}>
            Foque no que importa, no seu ritmo
          </Texto>
          <Texto cor={c.tintaSuave} style={{ textAlign: 'center' }}>
            Sessões curtas de estudo, metas que você escolhe e pontos a cada vitória. Sem bloquear nada.
          </Texto>
        </View>
      </View>
    </Tela>
  );
}
