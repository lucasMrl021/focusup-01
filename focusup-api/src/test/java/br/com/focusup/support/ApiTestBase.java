package br.com.focusup.support;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Primary;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.Map;
import java.util.UUID;


import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Base dos testes de integração: sobe a API inteira com banco H2 em memória,
 * chama os endpoints como o app faria e desfaz tudo no fim de cada teste.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@Import(ApiTestBase.Config.class)
public abstract class ApiTestBase {

    @TestConfiguration
    static class Config {
        @Bean
        @Primary
        RelogioDeTeste relogioDeTeste() {
            return new RelogioDeTeste();
        }
    }

    @Autowired
    protected MockMvc mvc;

    @Autowired
    protected ObjectMapper json;

    @Autowired
    protected RelogioDeTeste relogio;

    @BeforeEach
    void reiniciarRelogio() {
        relogio.reiniciar();
    }

    /** Cria uma conta e devolve o token. */
    protected String cadastrar(String nome) throws Exception {
        String email = nome.toLowerCase().replace(' ', '.') + "." + UUID.randomUUID().toString().substring(0, 8) + "@teste.com";
        JsonNode resp = corpo(post("/api/auth/cadastro", null,
                Map.of("nome", nome, "email", email, "senha", "senha-segura-123"))
                .andExpect(status().isCreated()));
        return resp.get("token").asText();
    }

    protected ResultActions get(String url, String token) throws Exception {
        var req = org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get(url);
        if (token != null) req.header("Authorization", "Bearer " + token);
        return mvc.perform(req);
    }

    protected ResultActions post(String url, String token, Object body) throws Exception {
        var req = org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post(url)
                .contentType(MediaType.APPLICATION_JSON)
                .content(body == null ? "{}" : json.writeValueAsString(body));
        if (token != null) req.header("Authorization", "Bearer " + token);
        return mvc.perform(req);
    }

    protected ResultActions put(String url, String token, Object body) throws Exception {
        var req = org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put(url)
                .contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(body));
        if (token != null) req.header("Authorization", "Bearer " + token);
        return mvc.perform(req);
    }

    protected ResultActions delete(String url, String token) throws Exception {
        var req = org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete(url);
        if (token != null) req.header("Authorization", "Bearer " + token);
        return mvc.perform(req);
    }

    protected JsonNode corpo(ResultActions r) throws Exception {
        String texto = r.andReturn().getResponse().getContentAsString();
        return texto.isEmpty() ? json.createObjectNode() : json.readTree(texto);
    }

    /** Inicia uma sessão, espera o tempo dela passar e conclui. Devolve o resultado. */
    protected JsonNode fazerSessao(String token, int minutos) throws Exception {
        long id = corpo(post("/api/sessoes", token, Map.of("duracaoMinutos", minutos))
                .andExpect(status().isCreated())).get("id").asLong();
        relogio.avancar(Duration.ofMinutes(minutos));
        return corpo(post("/api/sessoes/" + id + "/concluir", token, null).andExpect(status().isOk()));
    }
}
