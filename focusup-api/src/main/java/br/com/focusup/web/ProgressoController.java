package br.com.focusup.web;

import br.com.focusup.service.ProgressoService;
import br.com.focusup.web.dto.Dtos.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ProgressoController {

    private final ProgressoService progresso;

    public ProgressoController(ProgressoService progresso) {
        this.progresso = progresso;
    }

    /** Tudo o que a tela 2.1 Início mostra, numa chamada só. */
    @GetMapping("/inicio")
    public InicioDto inicio(@AuthenticationPrincipal Long usuarioId) {
        return progresso.inicio(usuarioId);
    }

    @GetMapping("/conquistas")
    public ConquistasDto conquistas(@AuthenticationPrincipal Long usuarioId) {
        return progresso.conquistas(usuarioId);
    }

    @GetMapping("/estatisticas")
    public EstatisticasDto estatisticas(@AuthenticationPrincipal Long usuarioId,
                                        @RequestParam(defaultValue = "SEMANA") String periodo) {
        return progresso.estatisticas(usuarioId, periodo);
    }
}
