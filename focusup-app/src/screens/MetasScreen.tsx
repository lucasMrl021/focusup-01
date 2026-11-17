import React, { useState } from 'react';
import { View } from 'react-native';
import { api } from '../api/focusup';
import type { TipoMeta } from '../api/types';
import { Botao } from '../components/Botao';
import { CartaoMeta } from '../components/CartaoMeta';
import { Carregando, ErroCarregar } from '../components/EstadoVazio';
import { Ilustracao } from '../components/Ilustracao';
import { Segmentado } from '../components/Segmentado';
import { Tela } from '../components/Tela';
import { Texto } from '../components/Texto';
import { useCarregar } from '../hooks/useCarregar';
import type { AbaProps } from '../navigation/tipos';
import { useTema } from '../theme/ThemeProvider';
import { espaco } from '../theme/tokens';

/** 3.1 Minhas metas (RF03) */
export function MetasScreen({ navigation }: AbaProps<'Metas'>) {
  const { c } = useTema();
  const [filtro, setFiltro] = useState<TipoMeta>('DIARIA');
  const { dados, erro, carregando, recarregar } = useCarregar(api.metas);
  const filtradas = (dados ?? []).filter((m) => m.tipo === filtro);
  const temDoTipo = filtradas.length > 0;

  return (
    <Tela
      titulo="Minhas metas"
      aoRecarregar={recarregar}
      recarregando={carregando && !!dados}
      acaoTopo={
        !temDoTipo && dados ? (
          <Botao variante="texto" icone="mais" onPress={() => navigation.navigate('MetaForm')}>
            Nova meta
          </Botao>
        ) : undefined
      }
    >
      <Segmentado
        opcoes={[
          { valor: 'DIARIA', rotulo: 'Diárias' },
          { valor: 'SEMANAL', rotulo: 'Semanais' },
        ]}
        valor={filtro}
        aoMudar={setFiltro}
      />
      {!dados && carregando && <Carregando />}
      {!dados && erro && <ErroCarregar mensagem={erro} aoTentar={recarregar} />}
      {dados &&
        (temDoTipo ? (
          filtradas.map((m) => <CartaoMeta key={m.id} meta={m} onPress={() => navigation.navigate('MetaForm', { meta: m })} />)
        ) : (
          <View style={{ alignItems: 'center', gap: espaco[3], paddingTop: espaco[4] }}>
            <Ilustracao nome="metasVazio" largura={260} rotulo="Bandeira no alto de um morro" />
            <Texto estilo="subtitulo" style={{ textAlign: 'center' }}>
              {filtro === 'DIARIA' ? 'Nenhuma meta diária ainda' : 'Nenhuma meta semanal ainda'}
            </Texto>
            <Texto cor={c.tintaSuave} style={{ textAlign: 'center' }}>
              Uma meta ajuda a ver o quanto você já avançou. Comece com algo que caiba no seu dia.
            </Texto>
            <Botao onPress={() => navigation.navigate('MetaForm')} icone="mais">
              Nova meta
            </Botao>
          </View>
        ))}
      <Texto estilo="legenda" cor={c.tintaSuave}>
        Você pode ter uma meta diária e uma semanal.
      </Texto>
    </Tela>
  );
}
