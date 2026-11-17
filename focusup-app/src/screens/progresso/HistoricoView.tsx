import React from 'react';
import { View } from 'react-native';
import { api } from '../../api/focusup';
import { Cartao } from '../../components/Cartao';
import { Carregando, ErroCarregar } from '../../components/EstadoVazio';
import { Selo } from '../../components/Selo';
import { Texto } from '../../components/Texto';
import { formatarMinutos, horaCurta, rotuloDoDia } from '../../domain/format';
import { agruparPorDia } from '../../domain/historico';
import { useCarregar } from '../../hooks/useCarregar';
import { useTema } from '../../theme/ThemeProvider';
import { espaco } from '../../theme/tokens';

/** 5.2 Histórico de sessões (RF07) */
export function HistoricoView() {
  const { c } = useTema();
  const { dados, erro, carregando, recarregar } = useCarregar(() => api.historico(100));

  if (!dados && carregando) return <Carregando />;
  if (!dados && erro) return <ErroCarregar mensagem={erro} aoTentar={recarregar} />;
  if (!dados || dados.length === 0) {
    return (
      <Texto cor={c.tintaSuave} style={{ textAlign: 'center', paddingVertical: espaco[6] }}>
        Nenhuma sessão concluída ainda. Sua primeira está a um toque, na aba Foco.
      </Texto>
    );
  }
  return (
    <View style={{ gap: espaco[4] }}>
      {agruparPorDia(dados).map((g) => (
        <View key={g.dia} style={{ gap: espaco[2] }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Texto estilo="sobrelinha" cor={c.tintaSuave}>
              {rotuloDoDia(g.dia)}
            </Texto>
            <Texto estilo="sobrelinha" cor={c.tintaSuave}>
              {formatarMinutos(g.minutos)}
            </Texto>
          </View>
          <Cartao style={{ gap: espaco[2] }}>
            {g.sessoes.map((s) => (
              <View key={s.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Texto style={{ fontSize: 14 }}>{s.fim ? horaCurta(s.fim) : '--:--'}</Texto>
                <Texto style={{ fontSize: 14 }}>{formatarMinutos(s.duracaoMinutos)}</Texto>
                <Selo tom="pontos">+{s.pontos} pts</Selo>
              </View>
            ))}
          </Cartao>
        </View>
      ))}
    </View>
  );
}
