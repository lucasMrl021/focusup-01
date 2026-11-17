package br.com.focusup.service;

import br.com.focusup.domain.Usuario;
import br.com.focusup.repository.UsuarioRepository;
import br.com.focusup.security.JwtService;
import br.com.focusup.web.dto.Dtos.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.util.Locale;

/** Cadastro e login (RF01). O logout acontece no app, que apaga o token guardado. */
@Service
public class AuthService {

    private final UsuarioRepository usuarios;
    private final PasswordEncoder codificador;
    private final JwtService jwt;
    private final PerfilService perfis;
    private final Clock relogio;

    public AuthService(UsuarioRepository usuarios, PasswordEncoder codificador, JwtService jwt,
                       PerfilService perfis, Clock relogio) {
        this.usuarios = usuarios;
        this.codificador = codificador;
        this.jwt = jwt;
        this.perfis = perfis;
        this.relogio = relogio;
    }

    @Transactional
    public AuthResponse cadastrar(CadastroRequest req) {
        String email = req.email().trim().toLowerCase(Locale.ROOT);
        if (usuarios.existsByEmailIgnoreCase(email)) {
            throw new Excecoes.Conflito("Já existe uma conta com este e-mail");
        }
        String nome = req.nome().trim();
        String apelido = nome.split("\\s+")[0];
        if (apelido.length() > 40) {
            apelido = apelido.substring(0, 40);
        }
        Usuario u = usuarios.save(new Usuario(nome, email, codificador.encode(req.senha()), apelido, relogio.instant()));
        return new AuthResponse(jwt.gerarToken(u.getId()), perfis.perfil(u.getId()));
    }

    @Transactional(readOnly = true)
    public AuthResponse entrar(LoginRequest req) {
        Usuario u = usuarios.findByEmailIgnoreCase(req.email().trim())
                .filter(x -> codificador.matches(req.senha(), x.getSenhaHash()))
                .orElseThrow(Excecoes.CredenciaisInvalidas::new);
        return new AuthResponse(jwt.gerarToken(u.getId()), perfis.perfil(u.getId()));
    }
}
