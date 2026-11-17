package br.com.focusup.rules;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class NiveisTest {

    @ParameterizedTest(name = "{0} pontos = nível {1}")
    @CsvSource({"0,1", "249,1", "250,2", "749,2", "750,3", "1240,3", "1500,4", "2499,4", "2500,5"})
    void calculaNivelPelosPontos(int pontos, int nivelEsperado) {
        assertThat(Niveis.nivel(pontos)).isEqualTo(nivelEsperado);
    }

    @Test
    void cadaNivelPede250PontosAMaisQueOAnterior() {
        for (int n = 1; n < 20; n++) {
            int tamanhoAtual = Niveis.inicioDoNivel(n + 1) - Niveis.inicioDoNivel(n);
            int tamanhoSeguinte = Niveis.inicioDoNivel(n + 2) - Niveis.inicioDoNivel(n + 1);
            assertThat(tamanhoSeguinte - tamanhoAtual).isEqualTo(250);
        }
    }

    @Test
    void progressoMostraBaseProximoEQuantoFalta() {
        Niveis.ProgressoNivel p = Niveis.progresso(1240);
        assertThat(p.nivel()).isEqualTo(3);
        assertThat(p.base()).isEqualTo(750);
        assertThat(p.proximo()).isEqualTo(1500);
        assertThat(p.faltam()).isEqualTo(260);
    }

    @Test
    void recusaPontosNegativos() {
        assertThatThrownBy(() -> Niveis.nivel(-1)).isInstanceOf(IllegalArgumentException.class);
    }
}
