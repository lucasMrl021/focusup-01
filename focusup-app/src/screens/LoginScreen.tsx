import React, { useState } from 'react';
import { ApiError } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import { Botao } from '../components/Botao';
import { CampoTexto } from '../components/CampoTexto';
import { MensagemErro } from '../components/EstadoVazio';
import { Tela } from '../components/Tela';
import { validarEmail } from '../domain/validation';
import type { AcessoProps } from '../navigation/tipos';

/** 1.3 Login (RF01) */
export function LoginScreen({ navigation }: AcessoProps<'Login'>) {
  const { entrar } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [erroEmail, setErroEmail] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function enviar() {
    const e = validarEmail(email);
    setErroEmail(e);
    if (e) return;
    if (!senha) {
      setErro('Informe sua senha');
      return;
    }
    setEnviando(true);
    setErro(null);
    try {
      await entrar(email, senha);
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : 'Não foi possível entrar.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Tela
      titulo="Entrar"
      rodape={
        <>
          <Botao grande bloco carregando={enviando} onPress={enviar} testID="botao-entrar">
            Entrar
          </Botao>
          <Botao bloco variante="texto" onPress={() => navigation.replace('Cadastro')}>
            Criar conta
          </Botao>
        </>
      }
    >
      <MensagemErro texto={erro} />
      <CampoTexto
        rotulo="E-mail"
        value={email}
        onChangeText={setEmail}
        erro={erroEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
      />
      <CampoTexto rotulo="Senha" senha value={senha} onChangeText={setSenha} autoComplete="current-password" textContentType="password" />
    </Tela>
  );
}
