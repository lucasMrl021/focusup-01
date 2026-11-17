import { aoSessaoExpirar, ApiError, definirToken, requisicao } from '../src/api/client';

jest.mock('../src/config', () => ({ urlDaApi: () => 'http://api.teste' }));

function respostaFalsa(status: number, corpo?: unknown) {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => (corpo === undefined ? '' : JSON.stringify(corpo)),
  };
}

describe('cliente da API', () => {
  const fetchMock = jest.fn();
  beforeEach(() => {
    fetchMock.mockReset();
    (globalThis as unknown as { fetch: jest.Mock }).fetch = fetchMock;
    definirToken(null);
    aoSessaoExpirar(null);
  });

  it('manda o token e devolve o JSON', async () => {
    definirToken('abc');
    fetchMock.mockResolvedValue(respostaFalsa(200, { status: 'ok' }));
    await expect(requisicao('GET', '/api/saude')).resolves.toEqual({ status: 'ok' });
    const [url, opcoes] = fetchMock.mock.calls[0];
    expect(url).toBe('http://api.teste/api/saude');
    expect(opcoes.headers.Authorization).toBe('Bearer abc');
  });

  it('transforma erro da API na mensagem para a tela', async () => {
    fetchMock.mockResolvedValue(respostaFalsa(409, { mensagem: 'Já existe uma conta com este e-mail' }));
    await expect(requisicao('POST', '/api/auth/cadastro', {})).rejects.toEqual(new ApiError(409, 'Já existe uma conta com este e-mail'));
  });

  it('avisa quando o token expirou (401 com login ativo)', async () => {
    const expirou = jest.fn();
    aoSessaoExpirar(expirou);
    definirToken('velho');
    fetchMock.mockResolvedValue(respostaFalsa(401, { mensagem: 'Sua sessão expirou. Entre de novo.' }));
    await expect(requisicao('GET', '/api/inicio')).rejects.toBeInstanceOf(ApiError);
    expect(expirou).toHaveBeenCalledTimes(1);
  });

  it('senha errada no login (401 sem token) não dispara o logout', async () => {
    const expirou = jest.fn();
    aoSessaoExpirar(expirou);
    fetchMock.mockResolvedValue(respostaFalsa(401, { mensagem: 'E-mail ou senha incorretos' }));
    await expect(requisicao('POST', '/api/auth/login', {})).rejects.toThrow('E-mail ou senha incorretos');
    expect(expirou).not.toHaveBeenCalled();
  });

  it('sem conexão mostra mensagem amigável', async () => {
    fetchMock.mockRejectedValue(new TypeError('Network request failed'));
    await expect(requisicao('GET', '/api/inicio')).rejects.toThrow('Sem conexão com o servidor');
  });

  it('resposta vazia (204) devolve undefined', async () => {
    fetchMock.mockResolvedValue(respostaFalsa(204));
    await expect(requisicao('POST', '/api/sessoes/1/encerrar')).resolves.toBeUndefined();
  });
});
