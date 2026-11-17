package br.com.focusup.service;

import br.com.focusup.domain.Conquista;
import br.com.focusup.domain.SessaoFoco;
import br.com.focusup.rules.Niveis;
import br.com.focusup.web.dto.Dtos.*;

import java.time.Instant;

final class Mapeador {

    private Mapeador() {
    }

    static SessaoDto sessao(SessaoFoco s) {
        return new SessaoDto(s.getId(), s.getDuracaoMinutos(), s.getStatus().name(), s.getInicio(), s.getFim(),
                s.getDia(), s.getPontos());
    }

    static NivelDto nivel(int pontos) {
        Niveis.ProgressoNivel p = Niveis.progresso(pontos);
        return new NivelDto(p.nivel(), p.pontos(), p.base(), p.proximo());
    }

    static ConquistaDto conquista(Conquista c, Instant conquistadaEm) {
        return new ConquistaDto(c.name(), c.getNome(), c.getDescricao(), c.getDica(), c.getIcone(), c.getTom(),
                conquistadaEm != null, conquistadaEm);
    }
}
