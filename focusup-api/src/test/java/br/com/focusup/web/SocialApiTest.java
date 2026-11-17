package br.com.focusup.web;

import br.com.focusup.support.ApiTestBase;
import org.junit.jupiter.api.Test;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** RF08 — amigos e ranking. */
class SocialApiTest extends ApiTestBase {

    private long idDe(String token) throws Exception {
        return corpo(get("/api/perfil", token)).get("id").asLong();
    }

    @Test
    void rankingOrdenaPorPontosEMarcaOUsuario() throws Exception {
        String lucas = cadastrar("Lucas");
        String bia = cadastrar("Bia");
        String rafa = cadastrar("Rafa");
        post("/api/amigos/" + idDe(bia), lucas, null).andExpect(status().isNoContent());
        post("/api/amigos/" + idDe(rafa), lucas, null).andExpect(status().isNoContent());

        fazerSessao(bia, 25);
        fazerSessao(bia, 25);
        fazerSessao(lucas, 25);

        get("/api/ranking", lucas)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(3))
                .andExpect(jsonPath("$[0].apelido").value("Bia"))
                .andExpect(jsonPath("$[0].pontos").value(50))
                .andExpect(jsonPath("$[1].apelido").value("Lucas"))
                .andExpect(jsonPath("$[1].voce").value(true))
                .andExpect(jsonPath("$[1].posicao").value(2))
                .andExpect(jsonPath("$[2].apelido").value("Rafa"));
    }

    @Test
    void amizadeValeNosDoisSentidos() throws Exception {
        String lucas = cadastrar("Lucas");
        String bia = cadastrar("Bia");
        post("/api/amigos/" + idDe(bia), lucas, null);
        get("/api/ranking", bia).andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void buscaPorApelidoMostraQuemJaEhAmigo() throws Exception {
        String lucas = cadastrar("Lucas");
        String bia = cadastrar("Bia Souza");
        cadastrar("Bianca");
        post("/api/amigos/" + idDe(bia), lucas, null);

        get("/api/amigos/busca?q=bia", lucas)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].apelido").value("Bia"))
                .andExpect(jsonPath("$[0].jaAmigo").value(true))
                .andExpect(jsonPath("$[1].apelido").value("Bianca"))
                .andExpect(jsonPath("$[1].jaAmigo").value(false));
    }

    @Test
    void naoAdicionaASiMesmoNemDuasVezes() throws Exception {
        String lucas = cadastrar("Lucas");
        String bia = cadastrar("Bia");
        post("/api/amigos/" + idDe(lucas), lucas, null).andExpect(status().isBadRequest());
        post("/api/amigos/" + idDe(bia), lucas, null).andExpect(status().isNoContent());
        post("/api/amigos/" + idDe(bia), lucas, null).andExpect(status().isConflict());
        post("/api/amigos/999999", lucas, null).andExpect(status().isNotFound());
    }
}
