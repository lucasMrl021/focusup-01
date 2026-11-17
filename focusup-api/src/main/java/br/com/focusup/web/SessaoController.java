package br.com.focusup.web;

import br.com.focusup.service.SessaoService;
import br.com.focusup.web.dto.Dtos.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessoes")
public class SessaoController {

    private final SessaoService sessoes;

    public SessaoController(SessaoService sessoes) {
        this.sessoes = sessoes;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SessaoDto iniciar(@AuthenticationPrincipal Long usuarioId, @Valid @RequestBody IniciarSessaoRequest req) {
        return sessoes.iniciar(usuarioId, req.duracaoMinutos());
    }

    @PostMapping("/{id}/concluir")
    public ResultadoSessaoDto concluir(@AuthenticationPrincipal Long usuarioId, @PathVariable Long id) {
        return sessoes.concluir(usuarioId, id);
    }

    @PostMapping("/{id}/encerrar")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void encerrar(@AuthenticationPrincipal Long usuarioId, @PathVariable Long id) {
        sessoes.encerrar(usuarioId, id);
    }

    @GetMapping
    public List<SessaoDto> historico(@AuthenticationPrincipal Long usuarioId,
                                     @RequestParam(defaultValue = "50") int limite) {
        return sessoes.historico(usuarioId, limite);
    }
}
