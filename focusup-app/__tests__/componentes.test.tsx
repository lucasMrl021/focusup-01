import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { Botao } from '../src/components/Botao';
import { CampoTexto } from '../src/components/CampoTexto';
import { CartaoMeta } from '../src/components/CartaoMeta';
import { CartaoNivel } from '../src/components/CartaoNivel';
import { EscolhaDuracao } from '../src/components/EscolhaDuracao';
import { Insignia } from '../src/components/Insignia';
import { LinhaRanking } from '../src/components/LinhaRanking';
import { SemanaSequencia } from '../src/components/SemanaSequencia';
import { ThemeProvider } from '../src/theme/ThemeProvider';

const comTema = (ui: React.ReactElement) => render(<ThemeProvider forcar="claro">{ui}</ThemeProvider>);

describe('Botao', () => {
  it('chama onPress ao tocar', () => {
    const onPress = jest.fn();
    comTema(<Botao onPress={onPress}>Iniciar sessão de foco</Botao>);
    fireEvent.press(screen.getByRole('button', { name: 'Iniciar sessão de foco' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('não responde quando desabilitado', () => {
    const onPress = jest.fn();
    comTema(
      <Botao onPress={onPress} desabilitado>
        Salvar meta
      </Botao>,
    );
    fireEvent.press(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });
});

describe('CampoTexto', () => {
  it('mostra o erro abaixo do campo', () => {
    comTema(<CampoTexto rotulo="E-mail" value="x" erro="E-mail inválido" />);
    expect(screen.getByText('E-mail inválido')).toBeTruthy();
  });

  it('alterna mostrar e ocultar senha', () => {
    comTema(<CampoTexto rotulo="Senha" senha value="segredo123" />);
    expect(screen.getByLabelText('Senha').props.secureTextEntry).toBe(true);
    fireEvent.press(screen.getByRole('button', { name: 'Mostrar senha' }));
    expect(screen.getByLabelText('Senha').props.secureTextEntry).toBe(false);
    expect(screen.getByRole('button', { name: 'Ocultar senha' })).toBeTruthy();
  });
});

describe('EscolhaDuracao', () => {
  it('mostra as quatro durações e o aviso de pontos', () => {
    const aoMudar = jest.fn();
    comTema(<EscolhaDuracao valor={25} aoMudar={aoMudar} />);
    ['15', '25', '45', '60'].forEach((m) => expect(screen.getByText(m)).toBeTruthy());
    expect(screen.getByText('+25 pontos ao concluir')).toBeTruthy();
    fireEvent.press(screen.getByTestId('duracao-45'));
    expect(aoMudar).toHaveBeenCalledWith(45);
  });
});

describe('CartaoMeta', () => {
  it('mostra quanto falta sem cor de erro', () => {
    comTema(<CartaoMeta meta={{ id: 1, tipo: 'DIARIA', minutosAlvo: 120, minutosFeitos: 70, cumprida: false }} />);
    expect(screen.getByText('2h por dia')).toBeTruthy();
    expect(screen.getByText(/de 2h · faltam 50 min/)).toBeTruthy();
    expect(screen.queryByText('Meta cumprida')).toBeNull();
  });

  it('mostra o selo quando a meta foi cumprida', () => {
    comTema(<CartaoMeta meta={{ id: 1, tipo: 'SEMANAL', minutosAlvo: 600, minutosFeitos: 615, cumprida: true }} />);
    expect(screen.getByText('Meta cumprida')).toBeTruthy();
    expect(screen.getByText(/você chegou lá/)).toBeTruthy();
  });
});

describe('CartaoNivel', () => {
  it('mostra nível, pontos e quanto falta', () => {
    comTema(<CartaoNivel nivel={{ nivel: 3, pontos: 1240, base: 750, proximo: 1500 }} />);
    expect(screen.getByText('3')).toBeTruthy();
    expect(screen.getByText('1.240 pts')).toBeTruthy();
    expect(screen.getByText('Faltam 260 pontos para o nível 4')).toBeTruthy();
  });
});

describe('SemanaSequencia', () => {
  it('com sequência zerada convida a recomeçar, sem bronca', () => {
    comTema(<SemanaSequencia sequencia={{ atual: 0, melhor: 9, semana: [false, false, false, false, false, false, false], hoje: 3 }} />);
    expect(screen.getByText('0 dias seguidos')).toBeTruthy();
    expect(screen.getByText('Recomece hoje, cada dia conta')).toBeTruthy();
  });

  it('marca os dias com foco', () => {
    comTema(<SemanaSequencia sequencia={{ atual: 3, melhor: 9, semana: [false, true, true, true, false, false, false], hoje: 3 }} />);
    expect(screen.getByText('3 dias seguidos')).toBeTruthy();
    expect(screen.getByLabelText('quarta, hoje: com foco')).toBeTruthy();
    expect(screen.getByLabelText('domingo: sem foco')).toBeTruthy();
  });
});

describe('Insignia', () => {
  it('bloqueada mostra a dica de como ganhar', () => {
    comTema(<Insignia conquista={{ nome: '7 dias seguidos', icone: 'sequencia', tom: 'chama', conquistada: false, dica: 'Foque 7 dias sem pular' }} />);
    expect(screen.getByLabelText('7 dias seguidos, bloqueada')).toBeTruthy();
    expect(screen.getByText('Foque 7 dias sem pular')).toBeTruthy();
  });
});

describe('LinhaRanking', () => {
  it('destaca a linha do usuário', () => {
    comTema(<LinhaRanking item={{ posicao: 3, usuarioId: 1, apelido: 'Lucas', foto: null, pontos: 1240, nivel: 3, sequencia: 3, voce: true }} />);
    expect(screen.getByText('3º')).toBeTruthy();
    expect(screen.getAllByText(/\(você\)/).length).toBeGreaterThan(0);
    expect(screen.getByText('1.240 pts')).toBeTruthy();
  });
});
