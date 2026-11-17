import React from 'react';
import { View } from 'react-native';
import type { Sequencia } from '../api/types';
import { useTema } from '../theme/ThemeProvider';
import { fontes, raio } from '../theme/tokens';
import { Cartao } from './Cartao';
import { Icone } from './Icone';
import { Texto } from './Texto';

const LETRAS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const NOMES = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

/** Dias seguidos e a semana com os dias de foco marcados (2.1, 5.3). */
export function SemanaSequencia({ sequencia, onPress }: { sequencia: Sequencia; onPress?: () => void }) {
  const { c } = useTema();
  const { atual, melhor, semana, hoje } = sequencia;
  return (
    <Cartao onPress={onPress} rotulo="Sequência de dias">
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ width: 48, height: 48, borderRadius: raio.total, backgroundColor: c.chamaSuave, alignItems: 'center', justifyContent: 'center' }}>
          <Icone nome="sequencia" cor={c.chama} tamanho={28} />
        </View>
        <View style={{ flexShrink: 1 }}>
          <Texto estilo="numero" style={{ fontSize: 20, lineHeight: 26 }}>
            {atual === 1 ? '1 dia seguido' : `${atual} dias seguidos`}
          </Texto>
          <Texto estilo="legenda" cor={c.tintaSuave}>
            {atual > 0 ? `Melhor sequência: ${melhor} ${melhor === 1 ? 'dia' : 'dias'}` : 'Recomece hoje, cada dia conta'}
          </Texto>
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {LETRAS.map((letra, i) => {
          const marcado = !!semana[i];
          return (
            <View
              key={i}
              style={{ alignItems: 'center', gap: 4 }}
              accessible
              accessibilityLabel={`${NOMES[i]}${i === hoje ? ', hoje' : ''}: ${marcado ? 'com foco' : 'sem foco'}`}
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: raio.total,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: marcado ? c.chama : c.superficieFunda,
                  borderWidth: i === hoje ? 2 : 0,
                  borderColor: c.tinta,
                }}
              >
                {marcado && <Icone nome="sequencia" cor={c.sobreChama} tamanho={16} />}
              </View>
              <Texto estilo="legenda" cor={c.tintaSuave} style={{ fontFamily: fontes.texto600, fontSize: 12 }}>
                {letra}
              </Texto>
            </View>
          );
        })}
      </View>
    </Cartao>
  );
}
