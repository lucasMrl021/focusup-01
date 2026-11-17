package br.com.focusup.service;

import br.com.focusup.domain.Meta;
import br.com.focusup.repository.MetaRepository;
import br.com.focusup.web.dto.Dtos.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.util.List;

/** Metas de estudo diárias e semanais (RF03). */
@Service
public class MetaService {

    private final MetaRepository metas;
    private final ProgressoService progresso;
    private final Clock relogio;

    public MetaService(MetaRepository metas, ProgressoService progresso, Clock relogio) {
        this.metas = metas;
        this.progresso = progresso;
        this.relogio = relogio;
    }

    @Transactional(readOnly = true)
    public List<MetaDto> listar(Long usuarioId) {
        return metas.findByUsuarioIdOrderByTipoAsc(usuarioId).stream().map(progresso::progressoDaMeta).toList();
    }

    @Transactional
    public MetaDto criar(Long usuarioId, MetaRequest req) {
        if (metas.existsByUsuarioIdAndTipo(usuarioId, req.tipo())) {
            throw new Excecoes.Conflito("Você já tem uma meta " + nomeDoTipo(req) + ". Edite a que existe.");
        }
        Meta meta = metas.save(new Meta(progresso.usuario(usuarioId), req.tipo(), req.minutosAlvo(), relogio.instant()));
        return progresso.progressoDaMeta(meta);
    }

    @Transactional
    public MetaDto atualizar(Long usuarioId, Long metaId, MetaRequest req) {
        Meta meta = buscar(usuarioId, metaId);
        if (meta.getTipo() != req.tipo() && metas.existsByUsuarioIdAndTipo(usuarioId, req.tipo())) {
            throw new Excecoes.Conflito("Você já tem uma meta " + nomeDoTipo(req) + ".");
        }
        meta.setTipo(req.tipo());
        meta.setMinutosAlvo(req.minutosAlvo());
        return progresso.progressoDaMeta(meta);
    }

    @Transactional
    public void excluir(Long usuarioId, Long metaId) {
        metas.delete(buscar(usuarioId, metaId));
    }

    private Meta buscar(Long usuarioId, Long metaId) {
        return metas.findByIdAndUsuarioId(metaId, usuarioId)
                .orElseThrow(() -> new Excecoes.NaoEncontrado("Meta não encontrada"));
    }

    private static String nomeDoTipo(MetaRequest req) {
        return switch (req.tipo()) {
            case DIARIA -> "diária";
            case SEMANAL -> "semanal";
        };
    }
}
