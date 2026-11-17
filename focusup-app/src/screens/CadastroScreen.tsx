import React, { useState } from 'react';
import { ApiError } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import { Botao } from '../components/Botao';
import { CampoTexto } from '../components/CampoTexto';
import { MensagemErro } from '../components/EstadoVazio';
import { Tela } from '../components/Tela';
import { validarEmail, validarNome, validarSenha } from '../domain/validation';
import type { AcessoProps } from '../navigation/tipos';

/** 1.2 Cadastro (RF01) */
export function CadastroScreen({ navigation }: AcessoProps<'Cadastro'>) {
  const { cadastrar } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erros, setErros] = useState<{ nome?: string | null; email?: string | null; senha?: string | null }>({});
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function enviar() {
    const novos = { nome: validarNome(nome), email: validarEmail(email), senha: validarSenha(senha) };
    setErros(novos);
    if (novos.nome || novos.email || novos.senha) return;
    setEnviando(true);
    setErroGeral(null);
    try {
      await cadastrar(nome, email, senha);
    } catch (e) {
      setErroGeral(e instanceof ApiError ? e.message : 'Não foi possível criar a conta.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Tela
      titulo="Criar conta"
      rodape={
        <>
          <Botao grande bloco carregando={enviando} onPress={enviar}>
            Criar conta
          </Botao>
          <Botao bloco variante="texto" onPress={() => navigation.replace('Login')}>
            Já tenho conta
          </Botao>
        </>
      }
    >
      <MensagemErro texto={erroGeral} />
      <CampoTexto rotulo="Nome" value={nome} onChangeText={setNome} erro={erros.nome} autoComplete="name" textContentType="name" />
      <CampoTexto
        rotulo="E-mail"
        value={email}
        onChangeText={setEmail}
        erro={erros.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
      />
      <CampoTexto
        rotulo="Senha"
        senha
        value={senha}
        onChangeText={setSenha}
        erro={erros.senha}
        dica="Pelo menos 8 caracteres"
        autoComplete="new-password"
        textContentType="newPassword"
      />
    </Tela>
  );
}
