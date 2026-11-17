import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { ApiError } from '../api/client';
import { api } from '../api/focusup';
import type { UsuarioBusca } from '../api/types';
import { Avatar } from '../components/Avatar';
import { Botao } from '../components/Botao';
import { CampoTexto } from '../components/CampoTexto';
import { Cartao } from '../components/Cartao';
import { MensagemErro } from '../components/EstadoVazio';
import { Selo } from '../components/Selo';
import { Tela } from '../components/Tela';
import { Texto } from '../components/Texto';
import { useTema } from '../theme/ThemeProvider';
import { espaco, fontes } from '../theme/tokens';

/** 6.2 Adicionar amigo (RF08): busca por apelido ou e-mail, sem precisar de aceite. */
export function AdicionarAmigoScreen() {
  const { c } = useTema();
  const [termo, setTermo] = useState('');
  const [resultados, setResultados] = useState<UsuarioBusca[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [adicionando, setAdicionando] = useState<number | null>(null);

  useEffect(() => {
    const t = termo.trim();
    if (t.length < 2) {
      setResultados([]);
      return;
    }
    let ativo = true;
    setBuscando(true);
    const id = setTimeout(async () => {
      try {
        const r = await api.buscarUsuarios(t);
        if (ativo) {
          setResultados(r);
          setErro(null);
        }
      } catch (e) {
        if (ativo) setErro(e instanceof ApiError ? e.message : 'Não foi possível buscar.');
      } finally {
        if (ativo) setBuscando(false);
      }
    }, 400);
    return () => {
      ativo = false;
      clearTimeout(id);
    };
  }, [termo]);

  async function adicionar(u: UsuarioBusca) {
    setAdicionando(u.id);
    try {
      await api.adicionarAmigo(u.id);
      setResultados((lista) => lista.map((x) => (x.id === u.id ? { ...x, jaAmigo: true } : x)));
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : 'Não foi possível adicionar.');
    } finally {
      setAdicionando(null);
    }
  }

  return (
    <Tela>
      <CampoTexto rotulo="Buscar por apelido ou e-mail" value={termo} onChangeText={setTermo} autoCapitalize="none" autoCorrect={false} placeholder="Ex.: bia" />
      <MensagemErro texto={erro} />
      {buscando && <ActivityIndicator color={c.foco} />}
      {!buscando && termo.trim().length >= 2 && resultados.length === 0 && (
        <Texto cor={c.tintaSuave}>Ninguém encontrado com “{termo.trim()}”.</Texto>
      )}
      <View style={{ gap: espaco[2] }}>
        {resultados.map((u) => (
          <Cartao key={u.id} style={{ flexDirection: 'row', alignItems: 'center', gap: espaco[3] }}>
            <Avatar nome={u.apelido} foto={u.foto} />
            <View style={{ flex: 1 }}>
              <Texto style={{ fontFamily: fontes.texto600 }}>{u.apelido}</Texto>
              <Texto estilo="legenda" cor={c.tintaSuave}>
                Nível {u.nivel}
              </Texto>
            </View>
            {u.jaAmigo ? (
              <Selo tom="foco">Amigo</Selo>
            ) : (
              <Botao carregando={adicionando === u.id} onPress={() => adicionar(u)}>
                Adicionar
              </Botao>
            )}
          </Cartao>
        ))}
      </View>
    </Tela>
  );
}
