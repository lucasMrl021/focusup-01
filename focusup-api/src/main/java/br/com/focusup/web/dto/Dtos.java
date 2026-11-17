package br.com.focusup.web.dto;

import br.com.focusup.domain.TipoMeta;
import jakarta.validation.constraints.*;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

/** Objetos que entram e saem da API (JSON). Agrupados num arquivo para facilitar a leitura. */
public final class Dtos {

    private Dtos() {
    }

    // ---------- Autenticação (RF01)
    public record CadastroRequest(
            @NotBlank(message = "Informe seu nome") @Size(max = 120) String nome,
            @NotBlank(message = "Informe seu e-mail") @Email(message = "E-mail inválido") String email,
            @NotBlank @Size(min = 8, max = 72, message = "A senha precisa ter de 8 a 72 caracteres") String senha) {
    }

    public record LoginRequest(@NotBlank @Email String email, @NotBlank String senha) {
    }

    public record AuthResponse(String token, PerfilDto usuario) {
    }

    // ---------- Perfil (RF02)
    public record PerfilDto(Long id, String nome, String email, String apelido, Integer idade, String serie,
                            String foto, int pontos, NivelDto nivel, int sequenciaAtual) {
    }

    public record AtualizarPerfilRequest(
            @NotBlank(message = "Informe um apelido") @Size(max = 40) String apelido,
            @Min(value = 8, message = "Idade mínima: 8") @Max(value = 25, message = "Idade máxima: 25") Integer idade,
            @Size(max = 40) String serie,
            @Size(max = 2_000_000, message = "Foto grande demais. Escolha uma imagem menor.") String foto) {
    }

    // ---------- Metas (RF03)
    public record MetaRequest(
            @NotNull(message = "Escolha diária ou semanal") TipoMeta tipo,
            @Min(value = 5, message = "A meta mínima é de 5 minutos")
            @Max(value = 10_080, message = "Meta grande demais") int minutosAlvo) {
    }

    public record MetaDto(Long id, TipoMeta tipo, int minutosAlvo, long minutosFeitos, boolean cumprida) {
    }

    // ---------- Sessões (RF04, RF05)
    public record IniciarSessaoRequest(@NotNull Integer duracaoMinutos) {
    }

    public record SessaoDto(Long id, int duracaoMinutos, String status, Instant inicio, Instant fim,
                            LocalDate dia, int pontos) {
    }

    public record ResultadoSessaoDto(SessaoDto sessao, int pontosGanhos, int bonusConstancia, NivelDto nivel,
                                     boolean subiuDeNivel, SequenciaDto sequencia, MetaDto metaHoje,
                                     List<ConquistaDto> novasConquistas) {
    }

    // ---------- Progresso (RF05, RF06, RF07)
    public record NivelDto(int nivel, int pontos, int base, int proximo) {
    }

    public record SequenciaDto(int atual, int melhor, List<Boolean> semana, int hoje) {
    }

    public record ConquistaDto(String codigo, String nome, String descricao, String dica, String icone, String tom,
                               boolean conquistada, Instant conquistadaEm) {
    }

    public record InicioDto(String apelido, String foto, NivelDto nivel, SequenciaDto sequencia, MetaDto metaHoje,
                            List<SessaoDto> ultimasSessoes) {
    }

    public record ConquistasDto(NivelDto nivel, SequenciaDto sequencia, List<ConquistaDto> conquistas) {
    }

    public record MinutosDoDiaDto(LocalDate data, long minutos) {
    }

    public record EstatisticasDto(String periodo, long totalMinutos, long totalSessoes, Integer metaDiariaMinutos,
                                  List<MinutosDoDiaDto> dias) {
    }

    // ---------- Social (RF08)
    public record RankingItemDto(int posicao, Long usuarioId, String apelido, String foto, int pontos, int nivel,
                                 int sequencia, boolean voce) {
    }

    public record UsuarioBuscaDto(Long id, String apelido, String foto, int nivel, boolean jaAmigo) {
    }

    public record ErroDto(String mensagem, List<String> detalhes) {
    }
}
