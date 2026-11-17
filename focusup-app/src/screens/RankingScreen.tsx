import React from 'react';
import { View } from 'react-native';
import { api } from '../api/focusup';
import type { ItemRanking } from '../api/types';
import { Avatar } from '../components/Avatar';
import { Botao } from '../components/Botao';
import { Carregando, ErroCarregar } from '../components/EstadoVazio';
import { LinhaRanking } from '../components/LinhaRanking';
import { Tela } from '../components/Tela';
import { Texto } from '../components/Texto';
import { formatarPontos } from '../domain/format';
import { useCarregar } from '../hooks/useCarregar';
import type { AbaProps } from '../navigation/tipos';
import { useTema } from '../theme/ThemeProvider';
import { espaco, fontes, raio } from '../theme/tokens';

function Podio({ tres }: { tres: ItemRanking[] }) {
  const { c } = useTema();
  // Ordem visual: 2º, 1º, 3º
  const ordem = [tres[1], tres[0], tres[2]].filter(Boolean) as ItemRanking[];
  const alturas: Record<number, number> = { 1: 96, 2: 72, 3: 56 };
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: espaco[3], backgroundColor: c.palco, borderRadius: raio.xl, padding: espaco[4], paddingTop: espaco[6] }}>
      {ordem.map((p) => (
        <View key={p.usuarioId} style={{ flex: 1, alignItems: 'center', gap: espaco[2] }}>
          <Avatar nome={p.apelido} foto={p.foto} tamanho={p.posicao === 1 ? 56 : 44} destaque={p.voce} />
          <Texto numberOfLines={1} cor={c.sobrePalco} style={{ fontFamily: fontes.texto600, fontSize: 14 }}>
            {p.apelido}
          </Texto>
          <Texto estilo="legenda" cor={c.sobrePalcoSuave}>
            {formatarPontos(p.pontos)} pts
          </Texto>
          <View style={{ alignSelf: 'stretch', height: alturas[p.posicao], borderTopLeftRadius: raio.md, borderTopRightRadius: raio.md, backgroundColor: p.posicao === 1 ? c.pontos : c.palcoTrilho, alignItems: 'center', paddingTop: espaco[2] }}>
            <Texto estilo="numero" cor={p.posicao === 1 ? c.sobrePontos : c.sobrePalco} style={{ fontSize: 20 }}>
              {p.posicao}º
            </Texto>
          </View>
        </View>
      ))}
    </View>
  );
}

/** 6.1 Ranking de amigos (RF08) */
export function RankingScreen({ navigation }: AbaProps<'Ranking'>) {
  const { c } = useTema();
  const { dados, erro, carregando, recarregar } = useCarregar(api.ranking);
  const eu = dados?.find((i) => i.voce);

  return (
    <Tela
      titulo="Ranking"
      aoRecarregar={recarregar}
      recarregando={carregando && !!dados}
      acaoTopo={
        <Botao variante="texto" icone="adicionar-amigo" onPress={() => navigation.navigate('AdicionarAmigo')}>
          Adicionar
        </Botao>
      }
    >
      {!dados && carregando && <Carregando />}
      {!dados && erro && <ErroCarregar mensagem={erro} aoTentar={recarregar} />}
      {dados && (
        <>
          {eu && (
            <View style={{ backgroundColor: c.focoSuave, borderRadius: raio.md, padding: espaco[3] }}>
              <Texto cor={c.foco} style={{ fontFamily: fontes.texto600, textAlign: 'center' }}>
                {dados.length === 1 ? 'Adicione amigos para começar a disputa' : `Você está em ${eu.posicao}º`}
              </Texto>
            </View>
          )}
          {dados.length > 1 && <Podio tres={dados.slice(0, 3)} />}
          <View style={{ gap: espaco[2] }}>
            {dados.map((item) => (
              <LinhaRanking key={item.usuarioId} item={item} />
            ))}
          </View>
          {dados.length === 1 && (
            <Botao bloco icone="adicionar-amigo" onPress={() => navigation.navigate('AdicionarAmigo')}>
              Adicionar amigo
            </Botao>
          )}
        </>
      )}
    </Tela>
  );
}
