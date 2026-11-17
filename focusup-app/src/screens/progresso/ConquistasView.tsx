import React, { useState } from 'react';
import { View } from 'react-native';
import { api } from '../../api/focusup';
import type { Conquista } from '../../api/types';
import { CartaoNivel } from '../../components/CartaoNivel';
import { Dialogo } from '../../components/Dialogo';
import { Carregando, ErroCarregar } from '../../components/EstadoVazio';
import { Ilustracao } from '../../components/Ilustracao';
import { Insignia } from '../../components/Insignia';
import { SemanaSequencia } from '../../components/SemanaSequencia';
import { Texto } from '../../components/Texto';
import { useCarregar } from '../../hooks/useCarregar';
import { espaco } from '../../theme/tokens';

function dataCurta(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

/** 5.3 Conquistas e sequências (RF05, RF06) */
export function ConquistasView() {
  const { dados, erro, carregando, recarregar } = useCarregar(api.conquistas);
  const [aberta, setAberta] = useState<Conquista | null>(null);

  if (!dados && carregando) return <Carregando />;
  if (!dados && erro) return <ErroCarregar mensagem={erro} aoTentar={recarregar} />;
  if (!dados) return null;

  return (
    <View style={{ gap: espaco[4] }}>
      {dados.sequencia.atual === 0 && <Ilustracao nome="recomeceHoje" largura={240} rotulo="Sol nascendo e a semana com o primeiro dia aceso" />}
      <SemanaSequencia sequencia={dados.sequencia} />
      <CartaoNivel nivel={dados.nivel} />
      <Texto estilo="subtitulo">Insígnias</Texto>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', rowGap: espaco[4] }}>
        {dados.conquistas.map((q) => (
          <Insignia key={q.codigo} conquista={q} onPress={() => setAberta(q)} />
        ))}
      </View>
      <Dialogo
        visivel={!!aberta}
        titulo={aberta?.nome ?? ''}
        mensagem={
          aberta
            ? aberta.conquistada && aberta.conquistadaEm
              ? `${aberta.descricao} Conquistada em ${dataCurta(aberta.conquistadaEm)}.`
              : `Ainda bloqueada. ${aberta.dica}.`
            : ''
        }
        cancelar="Fechar"
        aoCancelar={() => setAberta(null)}
      />
    </View>
  );
}
