package br.com.focusup.rules;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class PontuacaoTest {

    @Test
    void cadaSessaoVale25Pontos() {
        assertThat(Pontuacao.PONTOS_POR_SESSAO).isEqualTo(25);
    }

    @Test
    void bonusSoNaPrimeiraSessaoDoDiaQueFechaSeteDias() {
        assertThat(Pontuacao.bonusConstancia(7, true)).isEqualTo(100);
        assertThat(Pontuacao.bonusConstancia(14, true)).isEqualTo(100);
        assertThat(Pontuacao.bonusConstancia(7, false)).isZero();
        assertThat(Pontuacao.bonusConstancia(6, true)).isZero();
        assertThat(Pontuacao.bonusConstancia(0, true)).isZero();
    }
}
