import React from 'react';
import { Modal, Pressable, View } from 'react-native';
import { useTema } from '../theme/ThemeProvider';
import { espaco, raio } from '../theme/tokens';
import { Botao } from './Botao';
import { Texto } from './Texto';

type Props = {
  visivel: boolean;
  titulo: string;
  mensagem: string;
  /** Sem `confirmar`, o diálogo mostra só o botão de fechar. */
  confirmar?: string;
  cancelar?: string;
  aoConfirmar?: () => void;
  aoCancelar: () => void;
};

/** Confirmação gentil (encerrar sessão, excluir meta, sair). */
export function Dialogo({ visivel, titulo, mensagem, confirmar, cancelar = 'Voltar', aoConfirmar, aoCancelar }: Props) {
  const { c } = useTema();
  return (
    <Modal visible={visivel} transparent animationType="fade" onRequestClose={aoCancelar}>
      <Pressable accessibilityLabel="Fechar" onPress={aoCancelar} style={{ flex: 1, backgroundColor: '#00000066', justifyContent: 'center', padding: espaco[6] }}>
        <Pressable onPress={() => undefined} style={{ backgroundColor: c.superficie, borderRadius: raio.xl, padding: espaco[6], gap: espaco[4] }}>
          <Texto estilo="subtitulo" accessibilityRole="header">
            {titulo}
          </Texto>
          <Texto cor={c.tintaSuave}>{mensagem}</Texto>
          <View style={{ gap: espaco[2] }}>
            <Botao bloco onPress={aoCancelar}>
              {cancelar}
            </Botao>
            {confirmar && (
              <Botao bloco variante="secundario" onPress={aoConfirmar} testID="dialogo-confirmar">
                {confirmar}
              </Botao>
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
