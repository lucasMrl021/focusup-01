package br.com.focusup.rules;

/**
 * Cálculo de nível a partir dos pontos (RF05).
 *
 * O nível n começa em 125 × n × (n − 1) pontos: 0, 250, 750, 1500, 2500, 3750...
 * Cada nível pede 250 pontos a mais que o anterior, então subir fica mais difícil aos poucos.
 * A constância entra pelos pontos: cada sessão vale 25 e cada 7 dias seguidos dão bônus (ver {@link Pontuacao}).
 */
public final class Niveis {

    private Niveis() {
    }

    public static int nivel(int pontos) {
        if (pontos < 0) {
            throw new IllegalArgumentException("Pontos não podem ser negativos");
        }
        int n = 1;
        while (inicioDoNivel(n + 1) <= pontos) {
            n++;
        }
        return n;
    }

    /** Pontos em que o nível começa. */
    public static int inicioDoNivel(int nivel) {
        if (nivel < 1) {
            throw new IllegalArgumentException("Nível mínimo é 1");
        }
        return 125 * nivel * (nivel - 1);
    }

    public static ProgressoNivel progresso(int pontos) {
        int n = nivel(pontos);
        return new ProgressoNivel(n, pontos, inicioDoNivel(n), inicioDoNivel(n + 1));
    }

    public record ProgressoNivel(int nivel, int pontos, int base, int proximo) {
        public int faltam() {
            return proximo - pontos;
        }
    }
}
