/** Validações dos formulários. Devolvem a mensagem de erro ou null. */

export function validarNome(nome: string): string | null {
  return nome.trim().length === 0 ? 'Informe seu nome' : null;
}

export function validarEmail(email: string): string | null {
  const e = email.trim();
  if (e.length === 0) return 'Informe seu e-mail';
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) ? null : 'E-mail inválido';
}

export function validarSenha(senha: string): string | null {
  if (senha.length < 8) return 'A senha precisa ter pelo menos 8 caracteres';
  if (senha.length > 72) return 'A senha pode ter no máximo 72 caracteres';
  return null;
}

export function validarApelido(apelido: string): string | null {
  const a = apelido.trim();
  if (a.length === 0) return 'Informe um apelido';
  if (a.length > 40) return 'O apelido pode ter até 40 caracteres';
  return null;
}

/** Idade é opcional; quando preenchida, de 8 a 25. */
export function validarIdade(idade: string): string | null {
  if (idade.trim() === '') return null;
  const n = Number(idade);
  if (!Number.isInteger(n)) return 'Use só números';
  if (n < 8 || n > 25) return 'Idade entre 8 e 25 anos';
  return null;
}

/** Meta em horas e minutos: total de 5 min a 7 dias. */
export function validarMeta(horas: number, minutos: number): string | null {
  const total = horas * 60 + minutos;
  if (!Number.isFinite(total) || total < 5) return 'A meta mínima é de 5 minutos';
  if (total > 10_080) return 'Meta grande demais';
  return null;
}
