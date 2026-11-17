import React, { useState } from 'react';
import { ApiError } from '../api/client';
import { api } from '../api/focusup';
import { Botao } from '../components/Botao';
import { EscolhaDuracao } from '../components/EscolhaDuracao';
import { MensagemErro } from '../components/EstadoVazio';
import { Tela } from '../components/Tela';
import { Texto } from '../components/Texto';
import type { AbaProps } from '../navigation/tipos';
import { useTema } from '../theme/ThemeProvider';

/** 4.1 Escolher duração (RF04) */
export function DuracaoScreen({ navigation }: AbaProps<'Foco'>) {
  const { c } = useTema();
  const [duracao, setDuracao] = useState(25);
  const [iniciando, setIniciando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function comecar() {
    setIniciando(true);
    setErro(null);
    try {
      const sessao = await api.iniciarSessao(duracao);
      navigation.navigate('SessaoAtiva', { sessao });
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : 'Não foi possível começar a sessão.');
    } finally {
      setIniciando(false);
    }
  }

  return (
    <Tela
      titulo="Sessão de foco"
      rodape={
        <Botao grande bloco icone="foco" carregando={iniciando} onPress={comecar} testID="botao-comecar">
          Começar
        </Botao>
      }
    >
      <Texto cor={c.tintaSuave}>Escolha quanto tempo quer focar agora. Guarde o celular e volte quando o anel fechar.</Texto>
      <MensagemErro texto={erro} />
      <EscolhaDuracao valor={duracao} aoMudar={setDuracao} />
    </Tela>
  );
}
