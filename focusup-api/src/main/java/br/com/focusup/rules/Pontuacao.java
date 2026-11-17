package br.com.focusup.rules;

/** Pontos ganhos por sessão concluída (RF05). */
public final class Pontuacao {

    public static final int PONTOS_POR_SESSAO = 25;
    public static final int BONUS_SEMANA_SEGUIDA = 100;

    private Pontuacao() {
    }

    /**
     * Bônus de constância: na primeira sessão do dia em que a sequência chega a 7, 14, 21... dias,
     * o usuário ganha mais 100 pontos.
     */
    public static int bonusConstancia(int sequenciaAtual, boolean primeiraSessaoDoDia) {
        if (!primeiraSessaoDoDia || sequenciaAtual <= 0) {
            return 0;
        }
        return sequenciaAtual % 7 == 0 ? BONUS_SEMANA_SEGUIDA : 0;
    }
}
