/** Mesmas regras do backend (rules/Niveis.java), usadas para mostrar a barra de nível. */
export function inicioDoNivel(nivel: number): number {
  return 125 * nivel * (nivel - 1);
}

/** Fração (0 a 1) da barra entre o início do nível e o próximo. */
export function fracaoDoNivel(pontos: number, base: number, proximo: number): number {
  if (proximo <= base) return 1;
  return Math.min(1, Math.max(0, (pontos - base) / (proximo - base)));
}
