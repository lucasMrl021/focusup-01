import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { api } from '../../api/focusup';
import { Cartao } from '../../components/Cartao';
import { Carregando, ErroCarregar } from '../../components/EstadoVazio';
import { GraficoBarras } from '../../components/GraficoBarras';
import { Segmentado } from '../../components/Segmentado';
import { Texto } from '../../components/Texto';
import { formatarMinutos } from '../../domain/format';
import { useCarregar } from '../../hooks/useCarregar';
import { useTema } from '../../theme/ThemeProvider';
import { espaco } from '../../theme/tokens';

/** 5.1 Estatísticas (RF07) */
export function EstatisticasView() {
  const { c } = useTema();
  const [periodo, setPeriodo] = useState<'SEMANA' | 'MES'>('SEMANA');
  const buscar = useCallback(() => api.estatisticas(periodo), [periodo]);
  const { dados, erro, carregando, recarregar } = useCarregar(buscar);

  React.useEffect(() => {
    void recarregar();
  }, [periodo, recarregar]);

  return (
    <View style={{ gap: espaco[4] }}>
      <Segmentado
        opcoes={[
          { valor: 'SEMANA', rotulo: 'Semana' },
          { valor: 'MES', rotulo: 'Mês' },
        ]}
        valor={periodo}
        aoMudar={setPeriodo}
      />
      {!dados && carregando && <Carregando />}
      {!dados && erro && <ErroCarregar mensagem={erro} aoTentar={recarregar} />}
      {dados && (
        <>
          <View style={{ flexDirection: 'row', gap: espaco[3] }}>
            <Cartao style={{ flex: 1 }}>
              <Texto estilo="sobrelinha" cor={c.tintaSuave}>
                Tempo total
              </Texto>
              <Texto estilo="numero">{formatarMinutos(dados.totalMinutos)}</Texto>
            </Cartao>
            <Cartao style={{ flex: 1 }}>
              <Texto estilo="sobrelinha" cor={c.tintaSuave}>
                Sessões
              </Texto>
              <Texto estilo="numero">{dados.totalSessoes}</Texto>
            </Cartao>
          </View>
          <Cartao>
            <Texto estilo="subtitulo">Minutos por dia</Texto>
            <GraficoBarras dias={dados.dias} metaDiaria={dados.metaDiariaMinutos} />
            <Texto estilo="legenda" cor={c.tintaSuave}>
              {periodo === 'SEMANA' ? 'Últimos 7 dias' : 'Últimos 30 dias'}
              {dados.metaDiariaMinutos ? ' · linha tracejada: sua meta diária' : ''}
            </Texto>
          </Cartao>
        </>
      )}
    </View>
  );
}
