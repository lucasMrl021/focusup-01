import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { ApiError } from '../api/client';
import { api } from '../api/focusup';
import { Avatar } from '../components/Avatar';
import { Botao } from '../components/Botao';
import { CampoTexto } from '../components/CampoTexto';
import { Carregando, MensagemErro } from '../components/EstadoVazio';
import { Tela } from '../components/Tela';
import { Texto } from '../components/Texto';
import { validarApelido, validarIdade } from '../domain/validation';
import type { AppProps } from '../navigation/tipos';
import { useTema } from '../theme/ThemeProvider';
import { espaco } from '../theme/tokens';

/** 7.2 Editar perfil (RF02): foto (câmera ou galeria), apelido, idade e série. */
export function EditarPerfilScreen({ navigation }: AppProps<'EditarPerfil'>) {
  const { c } = useTema();
  const [carregado, setCarregado] = useState(false);
  const [apelido, setApelido] = useState('');
  const [idade, setIdade] = useState('');
  const [serie, setSerie] = useState('');
  const [foto, setFoto] = useState<string | null>(null);
  const [erros, setErros] = useState<{ apelido?: string | null; idade?: string | null }>({});
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    api
      .perfil()
      .then((p) => {
        setApelido(p.apelido);
        setIdade(p.idade ? String(p.idade) : '');
        setSerie(p.serie ?? '');
        setFoto(p.foto);
      })
      .catch((e) => setErro(e instanceof ApiError ? e.message : 'Não foi possível carregar o perfil.'))
      .finally(() => setCarregado(true));
  }, []);

  async function escolherFoto(origem: 'camera' | 'galeria') {
    const opcoes: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.3, base64: true };
    const permissao =
      origem === 'camera' ? await ImagePicker.requestCameraPermissionsAsync() : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      setErro('Sem permissão para acessar as fotos. Libere nas configurações do celular.');
      return;
    }
    const r = origem === 'camera' ? await ImagePicker.launchCameraAsync(opcoes) : await ImagePicker.launchImageLibraryAsync(opcoes);
    const asset = r.canceled ? null : r.assets[0];
    if (asset?.base64) setFoto(`data:${asset.mimeType ?? 'image/jpeg'};base64,${asset.base64}`);
  }

  async function salvar() {
    const novos = { apelido: validarApelido(apelido), idade: validarIdade(idade) };
    setErros(novos);
    if (novos.apelido || novos.idade) return;
    setSalvando(true);
    setErro(null);
    try {
      await api.atualizarPerfil({ apelido: apelido.trim(), idade: idade ? Number(idade) : null, serie: serie.trim() || null, foto: foto ?? '' });
      navigation.goBack();
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : 'Não foi possível salvar.');
    } finally {
      setSalvando(false);
    }
  }

  if (!carregado) {
    return (
      <Tela>
        <Carregando />
      </Tela>
    );
  }

  return (
    <Tela
      rodape={
        <Botao grande bloco carregando={salvando} onPress={salvar}>
          Salvar
        </Botao>
      }
    >
      <MensagemErro texto={erro} />
      <View style={{ alignItems: 'center', gap: espaco[3] }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Escolher foto na galeria" onPress={() => escolherFoto('galeria')}>
          <Avatar nome={apelido || '?'} foto={foto} tamanho={96} destaque />
        </Pressable>
        <View style={{ flexDirection: 'row', gap: espaco[2] }}>
          <Botao variante="secundario" onPress={() => escolherFoto('camera')}>
            Câmera
          </Botao>
          <Botao variante="secundario" onPress={() => escolherFoto('galeria')}>
            Galeria
          </Botao>
        </View>
        {foto && (
          <Botao variante="texto" onPress={() => setFoto(null)}>
            Remover foto
          </Botao>
        )}
      </View>
      <CampoTexto rotulo="Apelido" value={apelido} onChangeText={setApelido} erro={erros.apelido} maxLength={40} />
      <CampoTexto rotulo="Idade" value={idade} onChangeText={(t) => setIdade(t.replace(/\D/g, ''))} erro={erros.idade} keyboardType="number-pad" maxLength={2} />
      <CampoTexto rotulo="Série escolar" value={serie} onChangeText={setSerie} placeholder="Ex.: 2º ano do ensino médio" maxLength={40} />
      <Texto estilo="legenda" cor={c.tintaSuave}>
        Seu apelido aparece no ranking para os seus amigos.
      </Texto>
    </Tela>
  );
}
