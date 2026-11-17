import React, { useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import Svg, { Line, Rect, Text as SvgText } from 'react-native-svg';
import { formatarMinutos, letraDoDia } from '../domain/format';
import { useTema } from '../theme/ThemeProvider';
import { fontes } from '../theme/tokens';

type Props = { dias: { data: string; minutos: number }[]; metaDiaria: number | null };

/** Minutos de foco por dia, com a linha tracejada da meta diária (tela 5.1). */
export function GraficoBarras({ dias, metaDiaria }: Props) {
  const { c } = useTema();
  const [largura, setLargura] = useState(320);
  const altura = 180;
  const rodape = 20;
  const maximo = Math.max(30, metaDiaria ?? 0, ...dias.map((d) => d.minutos));
  const area = altura - rodape - 8;
  const passo = largura / Math.max(1, dias.length);
  const barra = Math.max(4, Math.min(28, passo * 0.6));
  const y = (m: number) => 8 + area - (area * m) / maximo;
  const mostrarLetra = dias.length <= 7;
  const total = dias.reduce((s, d) => s + d.minutos, 0);

  return (
    <View
      onLayout={(e: LayoutChangeEvent) => setLargura(e.nativeEvent.layout.width)}
      accessible
      accessibilityLabel={`Gráfico de minutos por dia. Total ${formatarMinutos(total)}${metaDiaria ? `, meta diária ${formatarMinutos(metaDiaria)}` : ''}.`}
    >
      <Svg width={largura} height={altura}>
        {dias.map((d, i) => {
          const h = Math.max(d.minutos > 0 ? 4 : 0, area - (y(d.minutos) - 8));
          const x = i * passo + (passo - barra) / 2;
          return <Rect key={d.data} x={x} y={8 + area - h} width={barra} height={h} rx={Math.min(6, barra / 2)} fill={c.foco} opacity={d.minutos > 0 ? 1 : 0} />;
        })}
        <Line x1={0} x2={largura} y1={8 + area} y2={8 + area} stroke={c.linha} strokeWidth={1} />
        {metaDiaria != null && (
          <>
            <Line x1={0} x2={largura} y1={y(metaDiaria)} y2={y(metaDiaria)} stroke={c.chama} strokeWidth={2} strokeDasharray="6 6" />
            <SvgText x={largura - 4} y={y(metaDiaria) - 6} fill={c.chamaTexto} fontSize={12} fontFamily={fontes.texto600} textAnchor="end">
              Meta {formatarMinutos(metaDiaria)}
            </SvgText>
          </>
        )}
        {dias.map((d, i) =>
          mostrarLetra || i % 5 === 0 ? (
            <SvgText key={`l-${d.data}`} x={i * passo + passo / 2} y={altura - 4} fill={c.tintaSuave} fontSize={12} fontFamily={fontes.texto600} textAnchor="middle">
              {mostrarLetra ? letraDoDia(d.data) : d.data.slice(8, 10)}
            </SvgText>
          ) : null,
        )}
      </Svg>
    </View>
  );
}
