import { usePreventRemove } from '@react-navigation/native';
import { useKeepAwake } from 'expo-keep-awake';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApiError } from '../api/client';
import { api } from '../api/focusup';
import type { ResultadoSessao } from '../api/types';
import { AnelCronometro } from '../components/AnelCronometro';
import { Botao } from '../components/Botao';
import { Dialogo } from '../components/Dialogo';
import { MensagemErro } from '../components/EstadoVazio';
import { Texto } from '../components/Texto';
import { useContagem } from '../hooks/useContagem';
import type { AppProps } from '../navigation/tipos';
import { useTema } from '../theme/ThemeProvider';
import { espaco } from '../theme/tokens';

const FRASES = [
  'Um passo de cada vez.',
  'Você está construindo um hábito.',
  'Respire. Só este bloco importa agora.',
  'O celular pode esperar.',
];

/** 4.2 Sessão ativa (RF04): sem barra de abas, sem pausa, tela sempre acesa. */
export function SessaoAtivaScreen({ navigation, route }: AppProps<'SessaoAtiva'>) {
  useKeepAwake();
  const { c } = useTema();
  const { sessao } = route.params;
  const total = sessao.duracaoMinutos * 60;
  const fim = useMemo(() => Date.now() + total * 1000, [total]);
  const restante = useContagem(fim);
  const frase = useMemo(() => FRASES[sessao.id % FRASES.length], [sessao.id]);

  const [confirmar, setConfirmar] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [saida, setSaida] = useState<{ resultado: ResultadoSessao | null } | null>(null);
  const tentativas = useRef(0);

  // Voltar (gesto ou botão do Android) pede confirmação antes de sair.
  usePreventRemove(saida === null, () => setConfirmar(true));

  // Sai da tela só depois que o bloqueio de saída foi desligado.
  useEffect(() => {
    if (!saida) return;
    if (saida.resultado) navigation.replace('SessaoConcluida', { resultado: saida.resultado });
    else navigation.goBack();
  }, [saida, navigation]);

  useEffect(() => {
    if (restante > 0 || salvando) return;
    void concluir();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restante]);

  async function concluir() {
    setSalvando(true);
    setErro(null);
    try {
      const resultado = await api.concluirSessao(sessao.id);
      setSaida({ resultado });
    } catch (e) {
      // Se o relógio do celular adiantou um pouco, o servidor pede mais alguns segundos.
      if (e instanceof ApiError && e.status === 400 && tentativas.current < 3) {
        tentativas.current += 1;
        setTimeout(() => void concluir(), 5000);
        return;
      }
      setErro(e instanceof ApiError ? e.message : 'Não foi possível salvar a sessão.');
      setSalvando(false);
    }
  }

  async function encerrar() {
    setConfirmar(false);
    try {
      await api.encerrarSessao(sessao.id);
    } catch {
      // Mesmo sem conexão, a pessoa pode sair: nada é bloqueado.
    }
    setSaida({ resultado: null });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.fundo }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: espaco[6], padding: espaco[4] }}>
        <AnelCronometro total={total} restante={restante} legenda={`Bloco de ${sessao.duracaoMinutos} min`} />
        {salvando ? (
          <Texto cor={c.tintaSuave} accessibilityLiveRegion="polite">
            Salvando sua sessão…
          </Texto>
        ) : (
          <Texto estilo="subtitulo" style={{ textAlign: 'center' }}>
            {frase}
          </Texto>
        )}
        <MensagemErro texto={erro} />
        {erro && (
          <Botao variante="secundario" onPress={() => void concluir()}>
            Tentar salvar de novo
          </Botao>
        )}
      </View>
      {!salvando && (
        <View style={{ padding: espaco[4] }}>
          <Botao bloco variante="secundario" onPress={() => setConfirmar(true)} testID="botao-encerrar">
            Encerrar sessão
          </Botao>
        </View>
      )}
      <Dialogo
        visivel={confirmar}
        titulo="Encerrar a sessão agora?"
        mensagem="Você não ganha os pontos, mas nada é bloqueado."
        confirmar="Encerrar sessão"
        cancelar="Continuar focando"
        aoConfirmar={encerrar}
        aoCancelar={() => setConfirmar(false)}
      />
    </SafeAreaView>
  );
}
