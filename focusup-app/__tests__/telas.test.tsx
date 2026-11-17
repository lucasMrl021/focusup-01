import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import { ApiError } from '../src/api/client';
import { LoginScreen } from '../src/screens/LoginScreen';
import { SessaoAtivaScreen } from '../src/screens/SessaoAtivaScreen';
import { ThemeProvider } from '../src/theme/ThemeProvider';

const mockEntrar = jest.fn();
jest.mock('../src/auth/AuthContext', () => ({
  useAuth: () => ({ entrar: mockEntrar, cadastrar: jest.fn(), sair: jest.fn(), logado: false, carregando: false }),
}));

const mockEncerrarSessao = jest.fn(async () => undefined);
const mockConcluirSessao = jest.fn();
jest.mock('../src/api/focusup', () => ({
  api: {
    encerrarSessao: (...a: unknown[]) => mockEncerrarSessao(...(a as [])),
    concluirSessao: (...a: unknown[]) => mockConcluirSessao(...(a as [])),
  },
}));

jest.mock('@react-navigation/native', () => ({ usePreventRemove: jest.fn() }));
jest.mock('react-native-safe-area-context', () => {
  const { View } = jest.requireActual('react-native');
  return { SafeAreaView: View, useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }) };
});

const comTema = (ui: React.ReactElement) => render(<ThemeProvider forcar="claro">{ui}</ThemeProvider>);
const navegacao = () => ({ navigate: jest.fn(), replace: jest.fn(), goBack: jest.fn() });

describe('1.3 Login', () => {
  beforeEach(() => mockEntrar.mockReset());

  it('valida o e-mail antes de chamar a API', () => {
    comTema(<LoginScreen navigation={navegacao() as never} route={{ key: 'Login', name: 'Login' } as never} />);
    fireEvent.changeText(screen.getByLabelText('E-mail'), 'lucas@');
    fireEvent.press(screen.getByTestId('botao-entrar'));
    expect(screen.getByText('E-mail inválido')).toBeTruthy();
    expect(mockEntrar).not.toHaveBeenCalled();
  });

  it('mostra "E-mail ou senha incorretos" quando a API recusa', async () => {
    mockEntrar.mockRejectedValue(new ApiError(401, 'E-mail ou senha incorretos'));
    comTema(<LoginScreen navigation={navegacao() as never} route={{ key: 'Login', name: 'Login' } as never} />);
    fireEvent.changeText(screen.getByLabelText('E-mail'), 'lucas@email.com');
    fireEvent.changeText(screen.getByLabelText('Senha'), 'errada123');
    fireEvent.press(screen.getByTestId('botao-entrar'));
    expect(await screen.findByText('E-mail ou senha incorretos')).toBeTruthy();
    expect(mockEntrar).toHaveBeenCalledWith('lucas@email.com', 'errada123');
  });
});

describe('4.2 Sessão ativa', () => {
  const sessao = { id: 7, duracaoMinutos: 25, status: 'EM_ANDAMENTO' as const, inicio: '2026-11-04T16:00:00Z', fim: null, dia: null, pontos: 0 };

  beforeEach(() => {
    mockEncerrarSessao.mockClear();
    mockConcluirSessao.mockReset();
  });

  it('mostra o cronômetro cheio e a duração do bloco', () => {
    comTema(<SessaoAtivaScreen navigation={navegacao() as never} route={{ key: 'S', name: 'SessaoAtiva', params: { sessao } } as never} />);
    expect(screen.getByText('25:00')).toBeTruthy();
    expect(screen.getByText('Bloco de 25 min')).toBeTruthy();
  });

  it('encerrar pede confirmação, não bloqueia e volta', async () => {
    const nav = navegacao();
    comTema(<SessaoAtivaScreen navigation={nav as never} route={{ key: 'S', name: 'SessaoAtiva', params: { sessao } } as never} />);
    fireEvent.press(screen.getByTestId('botao-encerrar'));
    expect(screen.getByText('Você não ganha os pontos, mas nada é bloqueado.')).toBeTruthy();
    fireEvent.press(screen.getByTestId('dialogo-confirmar'));
    await waitFor(() => expect(mockEncerrarSessao).toHaveBeenCalledWith(7));
    await waitFor(() => expect(nav.goBack).toHaveBeenCalled());
    expect(mockConcluirSessao).not.toHaveBeenCalled();
  });

  it('ao zerar, salva a sessão e abre a tela de conclusão', async () => {
    jest.useFakeTimers();
    const nav = navegacao();
    const resultado = { pontosGanhos: 25 };
    mockConcluirSessao.mockResolvedValue(resultado);
    comTema(<SessaoAtivaScreen navigation={nav as never} route={{ key: 'S', name: 'SessaoAtiva', params: { sessao: { ...sessao, duracaoMinutos: 15 } } } as never} />);
    jest.advanceTimersByTime(15 * 60 * 1000 + 500);
    await waitFor(() => expect(mockConcluirSessao).toHaveBeenCalledWith(7));
    await waitFor(() => expect(nav.replace).toHaveBeenCalledWith('SessaoConcluida', { resultado }));
    jest.useRealTimers();
  });
});
