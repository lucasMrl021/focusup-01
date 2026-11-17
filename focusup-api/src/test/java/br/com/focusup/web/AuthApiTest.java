package br.com.focusup.web;

import br.com.focusup.domain.Usuario;
import br.com.focusup.repository.UsuarioRepository;
import br.com.focusup.support.ApiTestBase;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.Duration;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** RF01 — cadastro e autenticação; RNF04 — senha criptografada. */
class AuthApiTest extends ApiTestBase {

    @Autowired
    UsuarioRepository usuarios;

    @Test
    void cadastroDevolveTokenEPerfilComApelidoDoPrimeiroNome() throws Exception {
        post("/api/auth/cadastro", null, Map.of("nome", "Lucas Meirelles", "email", "Lucas@Email.com", "senha", "segredo123"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.usuario.apelido").value("Lucas"))
                .andExpect(jsonPath("$.usuario.email").value("lucas@email.com"))
                .andExpect(jsonPath("$.usuario.nivel.nivel").value(1))
                .andExpect(jsonPath("$.usuario.senhaHash").doesNotExist());
    }

    @Test
    void senhaFicaGuardadaCriptografada() throws Exception {
        post("/api/auth/cadastro", null, Map.of("nome", "Bia", "email", "bia@email.com", "senha", "segredo123"))
                .andExpect(status().isCreated());
        Usuario bia = usuarios.findByEmailIgnoreCase("bia@email.com").orElseThrow();
        assertThat(bia.getSenhaHash()).isNotEqualTo("segredo123").startsWith("$2");
    }

    @Test
    void emailRepetidoDevolve409() throws Exception {
        var corpo = Map.of("nome", "Rafa", "email", "rafa@email.com", "senha", "segredo123");
        post("/api/auth/cadastro", null, corpo).andExpect(status().isCreated());
        post("/api/auth/cadastro", null, corpo)
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.mensagem").value("Já existe uma conta com este e-mail"));
    }

    @Test
    void cadastroValidaCampos() throws Exception {
        post("/api/auth/cadastro", null, Map.of("nome", "", "email", "nao-e-email", "senha", "123"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.detalhes.length()").value(3));
    }

    @Test
    void loginComSenhaCertaEntra() throws Exception {
        post("/api/auth/cadastro", null, Map.of("nome", "Emanuel", "email", "emanuel@email.com", "senha", "segredo123"));
        post("/api/auth/login", null, Map.of("email", "EMANUEL@email.com", "senha", "segredo123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty());
    }

    @Test
    void loginComSenhaErradaDevolve401ComMensagemDaTela() throws Exception {
        post("/api/auth/cadastro", null, Map.of("nome", "Danyel", "email", "danyel@email.com", "senha", "segredo123"));
        post("/api/auth/login", null, Map.of("email", "danyel@email.com", "senha", "errada123"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.mensagem").value("E-mail ou senha incorretos"));
    }

    @Test
    void rotaProtegidaSemTokenDevolve401() throws Exception {
        get("/api/inicio", null).andExpect(status().isUnauthorized());
        get("/api/inicio", "token-invalido").andExpect(status().isUnauthorized());
    }

    @Test
    void tokenExpiraDepoisDeSeteDias() throws Exception {
        String token = cadastrar("Lucas");
        get("/api/perfil", token).andExpect(status().isOk());
        relogio.avancar(Duration.ofDays(8));
        get("/api/perfil", token).andExpect(status().isUnauthorized());
    }
}
