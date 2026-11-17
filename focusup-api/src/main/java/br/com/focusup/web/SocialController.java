package br.com.focusup.web;

import br.com.focusup.service.SocialService;
import br.com.focusup.web.dto.Dtos.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SocialController {

    private final SocialService social;

    public SocialController(SocialService social) {
        this.social = social;
    }

    @GetMapping("/ranking")
    public List<RankingItemDto> ranking(@AuthenticationPrincipal Long usuarioId) {
        return social.ranking(usuarioId);
    }

    @GetMapping("/amigos/busca")
    public List<UsuarioBuscaDto> buscar(@AuthenticationPrincipal Long usuarioId, @RequestParam("q") String termo) {
        return social.buscar(usuarioId, termo);
    }

    @PostMapping("/amigos/{amigoId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void adicionar(@AuthenticationPrincipal Long usuarioId, @PathVariable Long amigoId) {
        social.adicionarAmigo(usuarioId, amigoId);
    }
}
