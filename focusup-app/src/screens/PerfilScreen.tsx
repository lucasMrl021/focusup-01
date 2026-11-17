import React, { useState } from 'react';
import { View } from 'react-native';
import { api } from '../api/focusup';
import { useAuth } from '../auth/AuthContext';
import { Avatar } from '../components/Avatar';
import { Botao } from '../components/Botao';
import { Cartao } from '../components/Cartao';
import { Dialogo } from '../components/Dialogo';
import { Carregando, ErroCarregar } from '../components/EstadoVazio';
import { Tela } from '../components/Tela';
import { Texto } from '../components/Texto';
import { formatarPontos } from '../domain/format';
import { useCarregar } from '../hooks/useCarregar';
import type { AppProps } from '../navigation/tipos';
import { useTema } from '../theme/ThemeProvider';
import { espaco } from '../theme/tokens';

function Numero({ rotulo, valor }: { rotulo: string; valor: string }) {
  const { c } = useTema();
  return (
    <Cartao style={{ flex: 1, alignItems: 'center', gap: 4 }}>
      <Texto estilo="numero" style={{ fontSize: 22 }}>
        {valor}
      </Texto>
      <Texto estilo="sobrelinha" cor={c.tintaSuave}>
        {rotulo}
      </Texto>
    </Cartao>
  );
}

/** 7.1 Meu perfil (RF02); "Sair" encerra o login (RF01). */
export function PerfilScreen({ navigation }: AppProps<'Perfil'>) {
  const { c } = useTema();
  const { sair } = useAuth();
  const { dados, erro, carregando, recarregar } = useCarregar(api.perfil);
  const [confirmarSaida, setConfirmarSaida] = useState(false);

  return (
    <Tela
      rodape={
        dados && (
          <>
            <Botao bloco onPress={() => navigation.navigate('EditarPerfil')}>
              Editar perfil
            </Botao>
            <Botao bloco variante="secundario" onPress={() => setConfirmarSaida(true)}>
              Sair
            </Botao>
          </>
        )
      }
    >
      {!dados && carregando && <Carregando />}
      {!dados && erro && <ErroCarregar mensagem={erro} aoTentar={recarregar} />}
      {dados && (
        <>
          <View style={{ alignItems: 'center', gap: espaco[2], paddingTop: espaco[4] }}>
            <Avatar nome={dados.apelido} foto={dados.foto} tamanho={96} destaque />
            <Texto estilo="titulo">{dados.apelido}</Texto>
            <Texto cor={c.tintaSuave}>
              {[dados.idade ? `${dados.idade} anos` : null, dados.serie].filter(Boolean).join(' · ') || 'Complete seu perfil'}
            </Texto>
          </View>
          <View style={{ flexDirection: 'row', gap: espaco[3] }}>
            <Numero rotulo="Nível" valor={String(dados.nivel.nivel)} />
            <Numero rotulo="Pontos" valor={formatarPontos(dados.pontos)} />
            <Numero rotulo="Sequência" valor={`${dados.sequenciaAtual}d`} />
          </View>
          <Texto estilo="legenda" cor={c.tintaSuave} style={{ textAlign: 'center' }}>
            {dados.email}
          </Texto>
        </>
      )}
      <Dialogo
        visivel={confirmarSaida}
        titulo="Sair da conta?"
        mensagem="Seus pontos, metas e conquistas ficam guardados. É só entrar de novo."
        confirmar="Sair"
        aoConfirmar={() => {
          setConfirmarSaida(false);
          void sair();
        }}
        aoCancelar={() => setConfirmarSaida(false)}
      />
    </Tela>
  );
}
