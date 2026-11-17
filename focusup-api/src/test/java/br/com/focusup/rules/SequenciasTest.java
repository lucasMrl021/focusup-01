package br.com.focusup.rules;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class SequenciasTest {

    private static final LocalDate HOJE = LocalDate.of(2026, 11, 4); // quarta-feira

    @Test
    void semDiasASequenciaEZero() {
        Sequencias.Resultado r = Sequencias.calcular(List.of(), HOJE);
        assertThat(r.atual()).isZero();
        assertThat(r.melhor()).isZero();
    }

    @Test
    void contaDiasSeguidosAteHoje() {
        var dias = List.of(HOJE, HOJE.minusDays(1), HOJE.minusDays(2));
        assertThat(Sequencias.calcular(dias, HOJE).atual()).isEqualTo(3);
    }

    @Test
    void quemAindaNaoEstudouHojeNaoPerdeASequenciaDeOntem() {
        var dias = List.of(HOJE.minusDays(1), HOJE.minusDays(2));
        assertThat(Sequencias.calcular(dias, HOJE).atual()).isEqualTo(2);
    }

    @Test
    void umDiaSemFocoZeraASequencia() {
        var dias = List.of(HOJE.minusDays(2), HOJE.minusDays(3));
        assertThat(Sequencias.calcular(dias, HOJE).atual()).isZero();
    }

    @Test
    void melhorSequenciaGuardaORecorde() {
        var dias = List.of(
                HOJE.minusDays(10), HOJE.minusDays(9), HOJE.minusDays(8), HOJE.minusDays(7), // 4 seguidos
                HOJE.minusDays(1), HOJE);                                                    // 2 seguidos
        Sequencias.Resultado r = Sequencias.calcular(dias, HOJE);
        assertThat(r.atual()).isEqualTo(2);
        assertThat(r.melhor()).isEqualTo(4);
    }

    @Test
    void diasRepetidosContamUmaVez() {
        var dias = List.of(HOJE, HOJE, HOJE.minusDays(1));
        assertThat(Sequencias.calcular(dias, HOJE).atual()).isEqualTo(2);
    }

    @Test
    void semanaVaiDeDomingoASabado() {
        LocalDate domingo = LocalDate.of(2026, 11, 1);
        assertThat(Sequencias.inicioDaSemana(HOJE)).isEqualTo(domingo);
        assertThat(Sequencias.indiceDoDia(HOJE)).isEqualTo(3);
        assertThat(Sequencias.indiceDoDia(domingo)).isZero();

        var semana = Sequencias.semana(List.of(domingo.plusDays(1), HOJE), HOJE);
        assertThat(semana).containsExactly(false, true, false, true, false, false, false);
    }
}
