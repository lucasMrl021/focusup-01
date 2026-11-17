package br.com.focusup.rules;

import br.com.focusup.domain.Conquista;
import org.junit.jupiter.api.Test;

import java.util.EnumSet;

import static org.assertj.core.api.Assertions.assertThat;

class RegrasConquistaTest {

    @Test
    void usuarioNovoNaoTemConquistas() {
        var s = new RegrasConquista.Situacao(0, 0, false, 0, 1);
        assertThat(RegrasConquista.merecidas(s)).isEmpty();
    }

    @Test
    void primeiraSessaoDesbloqueiaPrimeiraConquista() {
        var s = new RegrasConquista.Situacao(1, 1, false, 25, 1);
        assertThat(RegrasConquista.merecidas(s)).containsExactly(Conquista.PRIMEIRA_SESSAO);
    }

    @Test
    void marcosDeSequenciaTempoMetaENivel() {
        var s = new RegrasConquista.Situacao(30, 7, true, 600, 5);
        assertThat(RegrasConquista.merecidas(s)).containsExactlyInAnyOrder(Conquista.values());
    }

    @Test
    void novasIgnoraOQueJaFoiConquistado() {
        var s = new RegrasConquista.Situacao(5, 3, false, 125, 1);
        var novas = RegrasConquista.novas(s, EnumSet.of(Conquista.PRIMEIRA_SESSAO));
        assertThat(novas).containsExactly(Conquista.SEQUENCIA_3);
    }
}
