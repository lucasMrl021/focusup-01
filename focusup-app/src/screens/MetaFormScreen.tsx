import React, { useState } from 'react';
import { View } from 'react-native';
import { ApiError } from '../api/client';
import { api } from '../api/focusup';
import type { TipoMeta } from '../api/types';
import { Botao } from '../components/Botao';
import { CampoTexto } from '../components/CampoTexto';
import { Dialogo } from '../components/Dialogo';
import { MensagemErro } from '../components/EstadoVazio';
import { Segmentado } from '../components/Segmentado';
import { Tela } from '../components/Tela';
import { Texto } from '../components/Texto';
import { formatarMinutos } from '../domain/format';
import { validarMeta } from '../domain/validation';
import type { AppProps } from '../navigation/tipos';
import { useTema } from '../theme/ThemeProvider';
import { espaco } from '../theme/tokens';

/** 3.2 Criar ou editar meta (RF03) */
export function MetaFormScreen({ navigation, route }: AppProps<'MetaForm'>) {
  const { c } = useTema();
  const meta = route.params?.meta;
  const [tipo, setTipo] = useState<TipoMeta>(meta?.tipo ?? 'DIARIA');
  const [horas, setHoras] = useState(meta ? String(Math.floor(meta.minutosAlvo / 60)) : '2');
  const [minutos, setMinutos] = useState(meta ? String(meta.minutosAlvo % 60) : '0');
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);

  const total = (Number(horas) || 0) * 60 + (Number(minutos) || 0);

  async function salvar() {
    const e = validarMeta(Number(horas) || 0, Number(minutos) || 0);
    setErro(e);
    if (e) return;
    setSalvando(true);
    try {
      if (meta) await api.atualizarMeta(meta.id, tipo, total);
      else await api.criarMeta(tipo, total);
      navigation.goBack();
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : 'Não foi possível salvar a meta.');
    } finally {
      setSalvando(false);
    }
  }

  async function excluir() {
    if (!meta) return;
    setConfirmarExclusao(false);
    try {
      await api.excluirMeta(meta.id);
      navigation.goBack();
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : 'Não foi possível excluir a meta.');
    }
  }

  return (
    <Tela
      rodape={
        <>
          <Botao grande bloco carregando={salvando} onPress={salvar}>
            Salvar meta
          </Botao>
          {meta && (
            <Botao bloco variante="secundario" onPress={() => setConfirmarExclusao(true)}>
              Excluir meta
            </Botao>
          )}
        </>
      }
    >
      <MensagemErro texto={erro} />
      <View style={{ gap: espaco[2] }}>
        <Texto estilo="rotulo" style={{ fontSize: 14 }}>
          Tipo
        </Texto>
        <Segmentado
          opcoes={[
            { valor: 'DIARIA', rotulo: 'Diária' },
            { valor: 'SEMANAL', rotulo: 'Semanal' },
          ]}
          valor={tipo}
          aoMudar={setTipo}
        />
      </View>
      <View style={{ flexDirection: 'row', gap: espaco[3] }}>
        <View style={{ flex: 1 }}>
          <CampoTexto rotulo="Horas" keyboardType="number-pad" value={horas} onChangeText={(t) => setHoras(t.replace(/\D/g, ''))} maxLength={3} />
        </View>
        <View style={{ flex: 1 }}>
          <CampoTexto rotulo="Minutos" keyboardType="number-pad" value={minutos} onChangeText={(t) => setMinutos(t.replace(/\D/g, ''))} maxLength={2} />
        </View>
      </View>
      <Texto cor={c.tintaSuave}>
        Alvo: {formatarMinutos(total)} {tipo === 'DIARIA' ? 'por dia' : 'por semana'}
      </Texto>
      <Dialogo
        visivel={confirmarExclusao}
        titulo="Excluir esta meta?"
        mensagem="Seu histórico de sessões continua salvo. Você pode criar outra meta quando quiser."
        confirmar="Excluir meta"
        aoConfirmar={excluir}
        aoCancelar={() => setConfirmarExclusao(false)}
      />
    </Tela>
  );
}
