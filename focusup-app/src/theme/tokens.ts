/**
 * Tokens do design system FocusUp (Parte 3 da documentação).
 * Cores com versão clara e escura; o resto vale para os dois temas.
 */
export const cores = {
  claro: {
    fundo: '#F2F6F5',
    superficie: '#FFFFFF',
    superficieFunda: '#E3ECEA',
    linha: '#CBDAD7',
    linhaForte: '#738F90',
    tinta: '#10262B',
    tintaSuave: '#4A6266',
    foco: '#0A6B6B',
    focoSuave: '#D3EEEA',
    sobreFoco: '#FFFFFF',
    chama: '#EE5A1A',
    chamaSuave: '#FFE6D9',
    chamaTexto: '#B23F0C',
    sobreChama: '#10262B',
    pontos: '#FFC23D',
    pontosSuave: '#FFF1CC',
    pontosTexto: '#7A5200',
    sobrePontos: '#10262B',
    palco: '#10262B',
    sobrePalco: '#FFFFFF',
    sobrePalcoSuave: '#A9C2C1',
    palcoTrilho: '#2C4A4E',
    alerta: '#B4232F',
    alertaSuave: '#FBE3E4',
  },
  escuro: {
    fundo: '#0B1A1D',
    superficie: '#132629',
    superficieFunda: '#1B3236',
    linha: '#2A464B',
    linhaForte: '#5A7A7E',
    tinta: '#E6F1EF',
    tintaSuave: '#9AB2B2',
    foco: '#3DC8BC',
    focoSuave: '#0E3A3A',
    sobreFoco: '#05201F',
    chama: '#FF7B3F',
    chamaSuave: '#3A1A0C',
    chamaTexto: '#FF9A6B',
    sobreChama: '#1A0B03',
    pontos: '#FFCF5C',
    pontosSuave: '#3A2C08',
    pontosTexto: '#FFD36B',
    sobrePontos: '#1A1403',
    palco: '#10393C',
    sobrePalco: '#E6F1EF',
    sobrePalcoSuave: '#9AB2B2',
    palcoTrilho: '#24575B',
    alerta: '#FF7A85',
    alertaSuave: '#3D1418',
  },
} as const;

export type Cores = { [K in keyof typeof cores.claro]: string };

export const espaco = { 1: 4, 2: 8, 3: 12, 4: 16, 6: 24, 8: 32 } as const;

export const raio = { sm: 8, md: 14, lg: 20, xl: 28, total: 9999 } as const;

/** Nomes das fontes carregadas em App.tsx com @expo-google-fonts. */
export const fontes = {
  display600: 'Unbounded_600SemiBold',
  display700: 'Unbounded_700Bold',
  texto400: 'Lexend_400Regular',
  texto500: 'Lexend_500Medium',
  texto600: 'Lexend_600SemiBold',
  texto700: 'Lexend_700Bold',
} as const;

export const tipo = {
  cronometro: { fontFamily: fontes.display600, fontSize: 56, lineHeight: 64, letterSpacing: -1 },
  tituloGrande: { fontFamily: fontes.display700, fontSize: 30, lineHeight: 36 },
  titulo: { fontFamily: fontes.display600, fontSize: 22, lineHeight: 28 },
  numero: { fontFamily: fontes.display700, fontSize: 26, lineHeight: 30 },
  subtitulo: { fontFamily: fontes.texto600, fontSize: 18, lineHeight: 24 },
  corpo: { fontFamily: fontes.texto400, fontSize: 16, lineHeight: 24 },
  rotulo: { fontFamily: fontes.texto600, fontSize: 16, lineHeight: 20 },
  legenda: { fontFamily: fontes.texto400, fontSize: 13, lineHeight: 18 },
  sobrelinha: { fontFamily: fontes.texto600, fontSize: 12, lineHeight: 16, letterSpacing: 1 },
} as const;
