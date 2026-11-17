package br.com.focusup.service;

import br.com.focusup.domain.Usuario;
import br.com.focusup.web.dto.Dtos.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Ver e editar o perfil (RF02). */
@Service
public class PerfilService {

    private final ProgressoService progresso;

    public PerfilService(ProgressoService progresso) {
        this.progresso = progresso;
    }

    @Transactional(readOnly = true)
    public PerfilDto perfil(Long usuarioId) {
        Usuario u = progresso.usuario(usuarioId);
        return new PerfilDto(u.getId(), u.getNome(), u.getEmail(), u.getApelido(), u.getIdade(), u.getSerie(),
                u.getFoto(), u.getPontos(), Mapeador.nivel(u.getPontos()), progresso.sequencia(usuarioId).atual());
    }

    @Transactional
    public PerfilDto atualizar(Long usuarioId, AtualizarPerfilRequest req) {
        Usuario u = progresso.usuario(usuarioId);
        u.setApelido(req.apelido().trim());
        u.setIdade(req.idade());
        u.setSerie(req.serie() == null || req.serie().isBlank() ? null : req.serie().trim());
        if (req.foto() != null) {
            if (!req.foto().isEmpty() && !req.foto().startsWith("data:image/")) {
                throw new Excecoes.RegraNegocio("Formato de foto inválido");
            }
            u.setFoto(req.foto().isEmpty() ? null : req.foto());
        }
        return perfil(usuarioId);
    }
}
