package br.com.focusup.web;

import br.com.focusup.support.ApiTestBase;
import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.Test;

import java.time.Duration;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** RF04 sessões de foco, RF05 pontos e níveis, RF06 conquistas e sequências. */
class SessaoApiTest extends ApiTestBase {

    @Test
    void sessaoConcluidaDa25PontosEAPrimeiraConquista() throws Exception {
        String token = cadastrar("Lucas");
        JsonNode r = fazerSessao(token, 25);

        assertThat(r.get("pontosGanhos").asInt()).isEqualTo(25);
        assertThat(r.get("bonusConstancia").asInt()).isZero();
        assertThat(r.at("/nivel/pontos").asInt()).isEqualTo(25);
        assertThat(r.at("/sequencia/atual").asInt()).isEqualTo(1);
        assertThat(r.at("/sessao/status").asText()).isEqualTo("CONCLUIDA");
        assertThat(r.get("novasConquistas")).hasSize(1);
        assertThat(r.at("/novasConquistas/0/codigo").asText()).isEqualTo("PRIMEIRA_SESSAO");

        // A segunda sessão não repete a conquista
        JsonNode r2 = fazerSessao(token, 15);
        assertThat(r2.get("novasConquistas")).isEmpty();
        assertThat(r2.at("/nivel/pontos").asInt()).isEqualTo(50);
    }

    @Test
    void soAceitaAsDuracoesDoApp() throws Exception {
        String token = cadastrar("Lucas");
        for (int minutos : new int[]{15, 25, 45, 60}) {
            post("/api/sessoes", token, Map.of("duracaoMinutos", minutos)).andExpect(status().isCreated());
        }
        post("/api/sessoes", token, Map.of("duracaoMinutos", 30))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.mensagem").value("Escolha 15, 25, 45 ou 60 minutos"));
    }

    @Test
    void naoConcluiAntesDoTempo() throws Exception {
        String token = cadastrar("Lucas");
        long id = corpo(post("/api/sessoes", token, Map.of("duracaoMinutos", 25))).get("id").asLong();
        relogio.avancar(Duration.ofMinutes(10));
        post("/api/sessoes/" + id + "/concluir", token, null)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.mensagem").value("A sessão ainda não terminou"));
    }

    @Test
    void encerrarAntesDoFimNaoDaPontosENemBloqueia() throws Exception {
        String token = cadastrar("Lucas");
        long id = corpo(post("/api/sessoes", token, Map.of("duracaoMinutos", 25))).get("id").asLong();
        relogio.avancar(Duration.ofMinutes(5));
        post("/api/sessoes/" + id + "/encerrar", token, null).andExpect(status().isNoContent());

        get("/api/perfil", token).andExpect(jsonPath("$.pontos").value(0));
        // Pode começar outra sessão em seguida
        post("/api/sessoes", token, Map.of("duracaoMinutos", 15)).andExpect(status().isCreated());
        // E não dá para concluir a encerrada depois
        post("/api/sessoes/" + id + "/concluir", token, null).andExpect(status().isConflict());
    }

    @Test
    void naoMexeNaSessaoDeOutraPessoa() throws Exception {
        String lucas = cadastrar("Lucas");
        String bia = cadastrar("Bia");
        long id = corpo(post("/api/sessoes", lucas, Map.of("duracaoMinutos", 15))).get("id").asLong();
        relogio.avancar(Duration.ofMinutes(15));
        post("/api/sessoes/" + id + "/concluir", bia, null).andExpect(status().isNotFound());
    }

    @Test
    void tresDiasSeguidosDesbloqueiamASequencia() throws Exception {
        String token = cadastrar("Lucas");
        fazerSessao(token, 25);
        relogio.avancar(Duration.ofDays(1));
        fazerSessao(token, 25);
        relogio.avancar(Duration.ofDays(1));
        JsonNode r = fazerSessao(token, 25);

        assertThat(r.at("/sequencia/atual").asInt()).isEqualTo(3);
        assertThat(r.get("novasConquistas").findValuesAsText("codigo")).containsExactly("SEQUENCIA_3");
    }

    @Test
    void seteDiasSeguidosDaoBonusDeConstancia() throws Exception {
        String token = cadastrar("Lucas");
        JsonNode r = null;
        for (int dia = 1; dia <= 7; dia++) {
            r = fazerSessao(token, 15);
            relogio.avancar(Duration.ofDays(1));
        }
        assertThat(r.at("/sequencia/atual").asInt()).isEqualTo(7);
        assertThat(r.get("bonusConstancia").asInt()).isEqualTo(100);
        assertThat(r.at("/nivel/pontos").asInt()).isEqualTo(7 * 25 + 100);
        assertThat(r.get("novasConquistas").findValuesAsText("codigo")).contains("SEQUENCIA_7");
    }

    @Test
    void subirDeNivelEhAvisado() throws Exception {
        String token = cadastrar("Lucas");
        JsonNode r = null;
        for (int i = 0; i < 10; i++) {   // 10 × 25 = 250 pontos = nível 2
            r = fazerSessao(token, 15);
        }
        assertThat(r.at("/nivel/nivel").asInt()).isEqualTo(2);
        assertThat(r.get("subiuDeNivel").asBoolean()).isTrue();
    }

    @Test
    void historicoListaDaMaisRecenteParaAMaisAntiga() throws Exception {
        String token = cadastrar("Lucas");
        fazerSessao(token, 15);
        fazerSessao(token, 45);
        get("/api/sessoes", token)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].duracaoMinutos").value(45))
                .andExpect(jsonPath("$[1].duracaoMinutos").value(15));
    }
}
