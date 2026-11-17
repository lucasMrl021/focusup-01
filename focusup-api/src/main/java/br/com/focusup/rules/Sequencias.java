package br.com.focusup.rules;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.TreeSet;

/** Sequência de dias seguidos com pelo menos uma sessão concluída (RF06). */
public final class Sequencias {

    private Sequencias() {
    }

    /**
     * @param diasComFoco dias em que houve sessão concluída (pode ter repetidos, qualquer ordem)
     * @param hoje        data de hoje no fuso do app
     */
    public static Resultado calcular(Collection<LocalDate> diasComFoco, LocalDate hoje) {
        TreeSet<LocalDate> dias = new TreeSet<>(diasComFoco);
        dias.removeIf(d -> d.isAfter(hoje));

        // Sequência atual: termina hoje ou ontem (quem ainda não estudou hoje não perde a sequência).
        int atual = 0;
        LocalDate cursor = dias.contains(hoje) ? hoje : hoje.minusDays(1);
        while (dias.contains(cursor)) {
            atual++;
            cursor = cursor.minusDays(1);
        }

        int melhor = 0;
        int corrida = 0;
        LocalDate anterior = null;
        for (LocalDate dia : dias) {
            corrida = (anterior != null && anterior.plusDays(1).equals(dia)) ? corrida + 1 : 1;
            melhor = Math.max(melhor, corrida);
            anterior = dia;
        }
        return new Resultado(atual, Math.max(melhor, atual));
    }

    /** Domingo da semana de {@code data} (a semana do app vai de domingo a sábado). */
    public static LocalDate inicioDaSemana(LocalDate data) {
        return data.with(TemporalAdjusters.previousOrSame(DayOfWeek.SUNDAY));
    }

    /** Sete valores, de domingo a sábado da semana de hoje: true se houve foco no dia. */
    public static List<Boolean> semana(Collection<LocalDate> diasComFoco, LocalDate hoje) {
        LocalDate domingo = inicioDaSemana(hoje);
        List<Boolean> semana = new ArrayList<>(7);
        for (int i = 0; i < 7; i++) {
            semana.add(diasComFoco.contains(domingo.plusDays(i)));
        }
        return semana;
    }

    /** Posição de hoje na semana (0 = domingo). */
    public static int indiceDoDia(LocalDate data) {
        return data.getDayOfWeek().getValue() % 7;
    }

    public record Resultado(int atual, int melhor) {
    }
}
