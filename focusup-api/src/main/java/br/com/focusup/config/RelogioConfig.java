package br.com.focusup.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Clock;
import java.time.ZoneId;

/** Relógio único do app. Nos testes ele é trocado por um relógio controlado. */
@Configuration
public class RelogioConfig {

    @Bean
    public Clock relogio(@Value("${focusup.fuso:America/Sao_Paulo}") String fuso) {
        return Clock.system(ZoneId.of(fuso));
    }
}
