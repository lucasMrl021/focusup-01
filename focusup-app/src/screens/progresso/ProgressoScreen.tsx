import React, { useEffect, useState } from 'react';
import { Segmentado } from '../../components/Segmentado';
import { Tela } from '../../components/Tela';
import type { AbaProgresso, AbaProps } from '../../navigation/tipos';
import { ConquistasView } from './ConquistasView';
import { EstatisticasView } from './EstatisticasView';
import { HistoricoView } from './HistoricoView';

/** Área Progresso: seletor no topo leva a 5.1 Estatísticas, 5.2 Histórico e 5.3 Conquistas (RF05–RF07). */
export function ProgressoScreen({ route }: AbaProps<'Progresso'>) {
  const [aba, setAba] = useState<AbaProgresso>(route.params?.aba ?? 'estatisticas');

  useEffect(() => {
    if (route.params?.aba) setAba(route.params.aba);
  }, [route.params?.aba]);

  return (
    <Tela titulo="Progresso">
      <Segmentado
        opcoes={[
          { valor: 'estatisticas', rotulo: 'Estatísticas' },
          { valor: 'historico', rotulo: 'Histórico' },
          { valor: 'conquistas', rotulo: 'Conquistas' },
        ]}
        valor={aba}
        aoMudar={setAba}
      />
      {aba === 'estatisticas' && <EstatisticasView />}
      {aba === 'historico' && <HistoricoView />}
      {aba === 'conquistas' && <ConquistasView />}
    </Tela>
  );
}
