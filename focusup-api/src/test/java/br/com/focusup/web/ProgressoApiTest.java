package br.com.focusup.web;

import br.com.focusup.support.ApiTestBase;
import org.junit.jupiter.api.Test;

import java.time.Duration;
import java.util.Map;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** RF02 perfil, RF07 histórico e estatísticas, tela 2.1 Início e 5.3 Conquistas. */
class ProgressoApiTest extends ApiTestBase {

    @Test
    void inicioReuneNivelSequenciaMetaEUltimasSessoes() throws Exception {
        String token = cadastrar("Lucas Meirelles");
        post("/api/metas", token, Map.of("tipo", "DIARIA", "minutosAlvo", 120));
        for (int i = 0; i < 4; i++) {
            fazerSessao(token, 15);
        }
        get("/api/inicio", token)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.apelido").value("Lucas"))
                .andExpect(jsonPath("$.nivel.pontos").value(100))
                .andExpect(jsonPath("$.nivel.proximo").value(250))
                .andExpect(jsonPath("$.sequencia.atual").value(1))
                .andExpect(jsonPath("$.sequencia.hoje").value(3))
                .andExpect(jsonPath("$.sequencia.semana[3]").value(true))
                .andExpect(jsonPath("$.metaHoje.minutosFeitos").value(60))
                .andExpect(jsonPath("$.ultimasSessoes.length()").value(3));
    }

    @Test
    void usuarioSemMetaRecebeMetaHojeNula() throws Exception {
        String token = cadastrar("Lucas");
        get("/api/inicio", token).andExpect(jsonPath("$.metaHoje").doesNotExist());
    }

    @Test
    void estatisticasDaSemanaSomamMinutosPorDia() throws Exception {
        String token = cadastrar("Lucas");
        fazerSessao(token, 25);
        relogio.avancar(Duration.ofDays(1));
        fazerSessao(token, 45);
        fazerSessao(token, 15);

        get("/api/estatisticas?periodo=SEMANA", token)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.dias.length()").value(7))
                .andExpect(jsonPath("$.totalMinutos").value(85))
                .andExpect(jsonPath("$.totalSessoes").value(3))
                .andExpect(jsonPath("$.dias[6].minutos").value(60))
                .andExpect(jsonPath("$.dias[5].minutos").value(25));

        get("/api/estatisticas?periodo=MES", token).andExpect(jsonPath("$.dias.length()").value(30));
        get("/api/estatisticas?periodo=ANO", token).andExpect(status().isBadRequest());
    }

    @Test
    void conquistasListaTodasComBloqueadasEDicas() throws Exception {
        String token = cadastrar("Lucas");
        fazerSessao(token, 25);
        get("/api/conquistas", token)
                .andExpect(jsonPath("$.conquistas.length()").value(6))
                .andExpect(jsonPath("$.conquistas[0].codigo").value("PRIMEIRA_SESSAO"))
                .andExpect(jsonPath("$.conquistas[0].conquistada").value(true))
                .andExpect(jsonPath("$.conquistas[2].conquistada").value(false))
                .andExpect(jsonPath("$.conquistas[2].dica").value("Foque 7 dias sem pular"));
    }

    @Test
    void editaPerfil() throws Exception {
        String token = cadastrar("Lucas");
        put("/api/perfil", token, Map.of("apelido", "Lukinhas", "idade", 16, "serie", "2º ano EM"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.apelido").value("Lukinhas"))
                .andExpect(jsonPath("$.idade").value(16))
                .andExpect(jsonPath("$.serie").value("2º ano EM"));

        put("/api/perfil", token, Map.of("apelido", "", "idade", 16))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.mensagem").value("Informe um apelido"));
    }

    @Test
    void recusaFotoQueNaoEhImagem() throws Exception {
        String token = cadastrar("Lucas");
        put("/api/perfil", token, Map.of("apelido", "Lucas", "foto", "javascript:alert(1)"))
                .andExpect(status().isBadRequest());
    }
}
