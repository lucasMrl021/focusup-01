package br.com.focusup.support;

import java.time.*;

/** Relógio que os testes podem adiantar, para simular sessões de 25 min e dias seguidos. */
public class RelogioDeTeste extends Clock {

    public static final ZoneId FUSO = ZoneId.of("America/Sao_Paulo");
    /** Quarta-feira, 4 de novembro de 2026, 13h em Brasília. */
    public static final Instant INICIO = ZonedDateTime.of(2026, 11, 4, 13, 0, 0, 0, FUSO).toInstant();

    private Instant agora = INICIO;

    public void reiniciar() {
        agora = INICIO;
    }

    public void avancar(Duration duracao) {
        agora = agora.plus(duracao);
    }

    @Override
    public ZoneId getZone() {
        return FUSO;
    }

    @Override
    public Clock withZone(ZoneId zone) {
        return Clock.fixed(agora, zone);
    }

    @Override
    public Instant instant() {
        return agora;
    }
}
