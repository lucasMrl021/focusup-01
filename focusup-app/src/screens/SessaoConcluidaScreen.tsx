import React, { useState } from 'react';
import { View } from 'react-native';
import { Botao } from '../components/Botao';
import { CartaoMeta } from '../components/CartaoMeta';
import { CartaoNivel } from '../components/CartaoNivel';
import { Ilustracao } from '../components/Ilustracao';
import { Insignia } from '../components/Insignia';
import { Selo } from '../components/Selo';
import { Tela } from '../components/Tela';
import { Texto } from '../components/Texto';
import { formatarMinutos } from '../domain/format';
import type { AppProps } from '../navigation/tipos';
import { useTema } from '../theme/ThemeProvider';
import { espaco } from '../theme/tokens';

/** 4.3 Sessão concluída (RF05, RF06) */
export function SessaoConcluidaScreen({ navigation, route }: AppProps<'SessaoConcluida'>) {
  const { c } = useTema();
  const { resultado } = route.params;
  const [conquista] = useState(resultado.novasConquistas[0]);

  return (
    <Tela
      rodape={
        <>
          <Botao grande bloco icone="foco" onPress={() => navigation.popTo('Abas', { screen: 'Foco' })}>
            Nova sessão
          </Botao>
          <Botao bloco variante="secundario" onPress={() => navigation.popTo('Abas', { screen: 'Inicio' })}>
            Voltar ao início
          </Botao>
        </>
      }
    >
      <View style={{ alignItems: 'center', gap: espaco[3], paddingTop: espaco[4] }}>
        <Ilustracao nome="sessaoConcluida" largura={220} rotulo="Anel de foco completo com um visto" />
        <Texto estilo="tituloGrande" accessibilityRole="header">
          Sessão concluída!
        </Texto>
        <Texto cor={c.tintaSuave}>Você focou {formatarMinutos(resultado.sessao.duracaoMinutos)}.</Texto>
        <View style={{ flexDirection: 'row', gap: espaco[2], flexWrap: 'wrap', justifyContent: 'center' }}>
          <Selo tom="pontos" icone="pontos">
            +{resultado.pontosGanhos} pontos
          </Selo>
          {resultado.bonusConstancia > 0 && (
            <Selo tom="chama" icone="sequencia">
              +{resultado.bonusConstancia} de bônus por {resultado.sequencia.atual} dias seguidos
            </Selo>
          )}
        </View>
      </View>

      {resultado.subiuDeNivel && (
        <Texto estilo="subtitulo" cor={c.foco} style={{ textAlign: 'center' }}>
          Você subiu para o nível {resultado.nivel.nivel}!
        </Texto>
      )}
      <CartaoNivel nivel={resultado.nivel} />

      {conquista && (
        <View style={{ alignItems: 'center', gap: espaco[2] }}>
          <Texto estilo="sobrelinha" cor={c.tintaSuave}>
            Nova conquista
          </Texto>
          <Insignia conquista={conquista} onPress={() => navigation.popTo('Abas', { screen: 'Progresso', params: { aba: 'conquistas' } })} />
        </View>
      )}

      {resultado.metaHoje && <CartaoMeta meta={resultado.metaHoje} />}
    </Tela>
  );
}
