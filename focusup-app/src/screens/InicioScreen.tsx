import React from 'react';
import { Pressable, View } from 'react-native';
import { api } from '../api/focusup';
import { Avatar } from '../components/Avatar';
import { Botao } from '../components/Botao';
import { Cartao } from '../components/Cartao';
import { CartaoMeta } from '../components/CartaoMeta';
import { CartaoNivel } from '../components/CartaoNivel';
import { Carregando, ErroCarregar } from '../components/EstadoVazio';
import { Ilustracao } from '../components/Ilustracao';
import { Selo } from '../components/Selo';
import { SemanaSequencia } from '../components/SemanaSequencia';
import { Tela } from '../components/Tela';
import { Texto } from '../components/Texto';
import { formatarMinutos, horaCurta, rotuloDoDia, saudacao } from '../domain/format';
import { useCarregar } from '../hooks/useCarregar';
import type { AbaProps } from '../navigation/tipos';
import { useTema } from '../theme/ThemeProvider';
import { espaco } from '../theme/tokens';

/** 2.1 Início */
export function InicioScreen({ navigation }: AbaProps<'Inicio'>) {
  const { c } = useTema();
  const { dados, erro, carregando, recarregar } = useCarregar(api.inicio);

  return (
    <Tela aoRecarregar={recarregar} recarregando={carregando && !!dados}>
      {!dados && carregando && <Carregando />}
      {!dados && erro && <ErroCarregar mensagem={erro} aoTentar={recarregar} />}
      {dados && (
        <>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Texto estilo="legenda" cor={c.tintaSuave} style={{ fontSize: 14 }}>
                {saudacao(new Date().getHours())}
              </Texto>
              <Texto estilo="titulo" accessibilityRole="header">
                Oi, {dados.apelido}
              </Texto>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="Abrir meu perfil" onPress={() => navigation.navigate('Perfil')}>
              <Avatar nome={dados.apelido} foto={dados.foto} tamanho={48} destaque />
            </Pressable>
          </View>

          <CartaoNivel nivel={dados.nivel} onPress={() => navigation.navigate('Progresso', { aba: 'conquistas' })} />

          {dados.metaHoje ? (
            <CartaoMeta meta={dados.metaHoje} onPress={() => navigation.navigate('Metas')} />
          ) : (
            <Cartao onPress={() => navigation.navigate('MetaForm')} rotulo="Defina sua primeira meta">
              <Ilustracao nome="metasVazio" largura={200} />
              <Texto estilo="subtitulo" style={{ textAlign: 'center' }}>
                Defina sua primeira meta
              </Texto>
              <Texto estilo="legenda" cor={c.tintaSuave} style={{ textAlign: 'center' }}>
                Escolha quanto tempo quer estudar por dia ou por semana.
              </Texto>
            </Cartao>
          )}

          <SemanaSequencia sequencia={dados.sequencia} onPress={() => navigation.navigate('Progresso', { aba: 'conquistas' })} />

          <Botao grande bloco icone="foco" onPress={() => navigation.navigate('Foco')}>
            Iniciar sessão de foco
          </Botao>

          <Cartao>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Texto estilo="sobrelinha" cor={c.tintaSuave}>
                Últimas sessões
              </Texto>
              <Botao variante="texto" onPress={() => navigation.navigate('Progresso', { aba: 'historico' })}>
                Ver tudo
              </Botao>
            </View>
            {dados.ultimasSessoes.length === 0 ? (
              <Texto estilo="legenda" cor={c.tintaSuave}>
                Suas sessões concluídas aparecem aqui.
              </Texto>
            ) : (
              dados.ultimasSessoes.map((s) => (
                <View key={s.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: espaco[2] }}>
                  <Texto style={{ fontSize: 14 }}>
                    {s.dia ? rotuloDoDia(s.dia) : ''}, {s.fim ? horaCurta(s.fim) : ''}
                  </Texto>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: espaco[2] }}>
                    <Texto style={{ fontSize: 14 }}>{formatarMinutos(s.duracaoMinutos)}</Texto>
                    <Selo tom="pontos">+{s.pontos}</Selo>
                  </View>
                </View>
              ))
            )}
          </Cartao>
        </>
      )}
    </Tela>
  );
}
