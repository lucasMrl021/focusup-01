import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useTema } from '../theme/ThemeProvider';
import { espaco } from '../theme/tokens';
import { Botao } from './Botao';
import { Texto } from './Texto';

export function Carregando() {
  const { c } = useTema();
  return (
    <View style={{ paddingVertical: espaco[8], alignItems: 'center' }}>
      <ActivityIndicator color={c.foco} size="large" accessibilityLabel="Carregando" />
    </View>
  );
}

/** Mensagem de erro com botão para tentar de novo. */
export function ErroCarregar({ mensagem, aoTentar }: { mensagem: string; aoTentar: () => void }) {
  const { c } = useTema();
  return (
    <View style={{ paddingVertical: espaco[6], gap: espaco[3], alignItems: 'center' }}>
      <Texto cor={c.tintaSuave} style={{ textAlign: 'center' }}>
        {mensagem}
      </Texto>
      <Botao variante="secundario" onPress={aoTentar}>
        Tentar de novo
      </Botao>
    </View>
  );
}

export function MensagemErro({ texto }: { texto: string | null }) {
  const { c } = useTema();
  if (!texto) return null;
  return (
    <View accessibilityRole="alert" style={{ backgroundColor: c.alertaSuave, borderRadius: 14, padding: espaco[3] }}>
      <Texto estilo="legenda" cor={c.alerta} style={{ fontSize: 14 }}>
        {texto}
      </Texto>
    </View>
  );
}
