package br.com.focusup.web;

import br.com.focusup.support.ApiTestBase;
import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** RF03 — metas de estudo. */
class MetaApiTest extends ApiTestBase {

    @Test
    void criaMetaDiariaEAcompanhaOProgresso() throws Exception {
        String token = cadastrar("Lucas");
        post("/api/metas", token, Map.of("tipo", "DIARIA", "minutosAlvo", 120))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.minutosFeitos").value(0))
                .andExpect(jsonPath("$.cumprida").value(false));

        fazerSessao(token, 45);
        fazerSessao(token, 25);

        get("/api/metas", token)
                .andExpect(jsonPath("$[0].minutosFeitos").value(70))
                .andExpect(jsonPath("$[0].cumprida").value(false));
    }

    @Test
    void cumprirAMetaDesbloqueiaConquista() throws Exception {
        String token = cadastrar("Lucas");
        post("/api/metas", token, Map.of("tipo", "DIARIA", "minutosAlvo", 30));
        fazerSessao(token, 15);
        JsonNode r = fazerSessao(token, 15);

        assertThat(r.at("/metaHoje/cumprida").asBoolean()).isTrue();
        assertThat(r.get("novasConquistas").findValuesAsText("codigo")).contains("META_CUMPRIDA");
    }

    @Test
    void soUmaMetaDeCadaTipo() throws Exception {
        String token = cadastrar("Lucas");
        post("/api/metas", token, Map.of("tipo", "SEMANAL", "minutosAlvo", 600)).andExpect(status().isCreated());
        post("/api/metas", token, Map.of("tipo", "SEMANAL", "minutosAlvo", 300)).andExpect(status().isConflict());
        post("/api/metas", token, Map.of("tipo", "DIARIA", "minutosAlvo", 60)).andExpect(status().isCreated());
        get("/api/metas", token)
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].tipo").value("DIARIA"));
    }

    @Test
    void editaEExcluiAMeta() throws Exception {
        String token = cadastrar("Lucas");
        long id = corpo(post("/api/metas", token, Map.of("tipo", "DIARIA", "minutosAlvo", 60))).get("id").asLong();
        put("/api/metas/" + id, token, Map.of("tipo", "DIARIA", "minutosAlvo", 90))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.minutosAlvo").value(90));
        delete("/api/metas/" + id, token).andExpect(status().isNoContent());
        get("/api/metas", token).andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void validaOTempoAlvo() throws Exception {
        String token = cadastrar("Lucas");
        post("/api/metas", token, Map.of("tipo", "DIARIA", "minutosAlvo", 2))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.mensagem").value("A meta mínima é de 5 minutos"));
    }

    @Test
    void naoEditaMetaDeOutraPessoa() throws Exception {
        String lucas = cadastrar("Lucas");
        String bia = cadastrar("Bia");
        long id = corpo(post("/api/metas", lucas, Map.of("tipo", "DIARIA", "minutosAlvo", 60))).get("id").asLong();
        put("/api/metas/" + id, bia, Map.of("tipo", "DIARIA", "minutosAlvo", 5)).andExpect(status().isNotFound());
    }
}
