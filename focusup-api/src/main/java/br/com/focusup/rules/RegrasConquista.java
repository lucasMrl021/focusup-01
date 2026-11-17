package br.com.focusup.rules;

import br.com.focusup.domain.Conquista;

import java.util.EnumSet;
import java.util.Set;

/** Decide quais conquistas o usuário já merece (RF06). */
public final class RegrasConquista {

    private RegrasConquista() {
    }

    public static Set<Conquista> merecidas(Situacao s) {
        Set<Conquista> resultado = EnumSet.noneOf(Conquista.class);
        if (s.sessoesConcluidas() >= 1) resultado.add(Conquista.PRIMEIRA_SESSAO);
        if (s.sequenciaAtual() >= 3) resultado.add(Conquista.SEQUENCIA_3);
        if (s.sequenciaAtual() >= 7) resultado.add(Conquista.SEQUENCIA_7);
        if (s.algumaMetaCumprida()) resultado.add(Conquista.META_CUMPRIDA);
        if (s.minutosTotais() >= 600) resultado.add(Conquista.DEZ_HORAS);
        if (s.nivel() >= 5) resultado.add(Conquista.NIVEL_5);
        return resultado;
    }

    /** Conquistas merecidas que o usuário ainda não tinha. */
    public static Set<Conquista> novas(Situacao s, Set<Conquista> jaConquistadas) {
        Set<Conquista> novas = merecidas(s);
        novas.removeAll(jaConquistadas);
        return novas;
    }

    public record Situacao(long sessoesConcluidas, int sequenciaAtual, boolean algumaMetaCumprida,
                           long minutosTotais, int nivel) {
    }
}
