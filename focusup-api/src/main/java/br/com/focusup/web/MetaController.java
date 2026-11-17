package br.com.focusup.web;

import br.com.focusup.service.MetaService;
import br.com.focusup.web.dto.Dtos.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/metas")
public class MetaController {

    private final MetaService metas;

    public MetaController(MetaService metas) {
        this.metas = metas;
    }

    @GetMapping
    public List<MetaDto> listar(@AuthenticationPrincipal Long usuarioId) {
        return metas.listar(usuarioId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MetaDto criar(@AuthenticationPrincipal Long usuarioId, @Valid @RequestBody MetaRequest req) {
        return metas.criar(usuarioId, req);
    }

    @PutMapping("/{id}")
    public MetaDto atualizar(@AuthenticationPrincipal Long usuarioId, @PathVariable Long id, @Valid @RequestBody MetaRequest req) {
        return metas.atualizar(usuarioId, id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@AuthenticationPrincipal Long usuarioId, @PathVariable Long id) {
        metas.excluir(usuarioId, id);
    }
}
