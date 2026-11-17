package br.com.focusup.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.Optional;

/** Gera e valida o token JWT usado no login (RF01). */
@Service
public class JwtService {

    private final SecretKey chave;
    private final Duration validade;
    private final Clock relogio;

    public JwtService(@Value("${focusup.jwt.segredo}") String segredo,
                      @Value("${focusup.jwt.validade-horas:168}") long validadeHoras,
                      Clock relogio) {
        byte[] bytes = segredo.getBytes(StandardCharsets.UTF_8);
        if (bytes.length < 32) {
            throw new IllegalStateException("focusup.jwt.segredo precisa ter pelo menos 32 caracteres");
        }
        this.chave = Keys.hmacShaKeyFor(bytes);
        this.validade = Duration.ofHours(validadeHoras);
        this.relogio = relogio;
    }

    public String gerarToken(Long usuarioId) {
        Instant agora = relogio.instant();
        return Jwts.builder()
                .subject(String.valueOf(usuarioId))
                .issuedAt(Date.from(agora))
                .expiration(Date.from(agora.plus(validade)))
                .signWith(chave)
                .compact();
    }

    /** Devolve o id do usuário se o token for válido e não tiver expirado. */
    public Optional<Long> validar(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(chave)
                    .clock(() -> Date.from(relogio.instant()))
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return Optional.of(Long.valueOf(claims.getSubject()));
        } catch (JwtException | IllegalArgumentException e) {
            return Optional.empty();
        }
    }
}
