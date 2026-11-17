import { validarApelido, validarEmail, validarIdade, validarMeta, validarNome, validarSenha } from '../src/domain/validation';

describe('validações dos formulários', () => {
  it('nome é obrigatório', () => {
    expect(validarNome('  ')).toBe('Informe seu nome');
    expect(validarNome('Lucas')).toBeNull();
  });

  it('e-mail precisa ter formato válido', () => {
    expect(validarEmail('')).toBe('Informe seu e-mail');
    expect(validarEmail('lucas@')).toBe('E-mail inválido');
    expect(validarEmail(' lucas@email.com ')).toBeNull();
  });

  it('senha tem de 8 a 72 caracteres, como no backend', () => {
    expect(validarSenha('1234567')).toMatch(/8 caracteres/);
    expect(validarSenha('12345678')).toBeNull();
    expect(validarSenha('x'.repeat(73))).toMatch(/72/);
  });

  it('apelido obrigatório e com até 40 caracteres', () => {
    expect(validarApelido('')).toBe('Informe um apelido');
    expect(validarApelido('a'.repeat(41))).toMatch(/40/);
    expect(validarApelido('Lukinhas')).toBeNull();
  });

  it('idade é opcional, de 8 a 25', () => {
    expect(validarIdade('')).toBeNull();
    expect(validarIdade('16')).toBeNull();
    expect(validarIdade('5')).toMatch(/8 e 25/);
    expect(validarIdade('1.5')).toBe('Use só números');
  });

  it('meta mínima de 5 minutos', () => {
    expect(validarMeta(0, 4)).toBe('A meta mínima é de 5 minutos');
    expect(validarMeta(2, 0)).toBeNull();
    expect(validarMeta(200, 0)).toBe('Meta grande demais');
  });
});
