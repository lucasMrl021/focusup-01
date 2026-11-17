package br.com.focusup.web;

import br.com.focusup.service.PerfilService;
import br.com.focusup.web.dto.Dtos.*;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/perfil")
public class PerfilController {

    private final PerfilService perfis;

    public PerfilController(PerfilService perfis) {
        this.perfis = perfis;
    }

    @GetMapping
    public PerfilDto ver(@AuthenticationPrincipal Long usuarioId) {
        return perfis.perfil(usuarioId);
    }

    @PutMapping
    public PerfilDto atualizar(@AuthenticationPrincipal Long usuarioId, @Valid @RequestBody AtualizarPerfilRequest req) {
        return perfis.atualizar(usuarioId, req);
    }
}
