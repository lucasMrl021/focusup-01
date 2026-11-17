package br.com.focusup.service;

import br.com.focusup.domain.Amizade;
import br.com.focusup.domain.Usuario;
import br.com.focusup.repository.AmizadeRepository;
import br.com.focusup.repository.UsuarioRepository;
import br.com.focusup.rules.Niveis;
import br.com.focusup.web.dto.Dtos.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/** Amigos e ranking (RF08). */
@Service
public class SocialService {

    private final UsuarioRepository usuarios;
    private final AmizadeRepository amizades;
    private final ProgressoService progresso;
    private final Clock relogio;

    public SocialService(UsuarioRepository usuarios, AmizadeRepository amizades, ProgressoService progresso, Clock relogio) {
        this.usuarios = usuarios;
        this.amizades = amizades;
        this.progresso = progresso;
        this.relogio = relogio;
    }

    /** Ranking do usuário com os amigos, por pontos; empate desempata pela sequência atual. */
    @Transactional(readOnly = true)
    public List<RankingItemDto> ranking(Long usuarioId) {
        List<Usuario> pessoas = new ArrayList<>();
        pessoas.add(progresso.usuario(usuarioId));
        amizades.findByUsuarioId(usuarioId).forEach(a -> pessoas.add(a.getAmigo()));

        record Linha(Usuario u, int sequencia) {
        }
        List<Linha> linhas = pessoas.stream()
                .map(u -> new Linha(u, progresso.sequencia(u.getId()).atual()))
                .sorted(Comparator.comparingInt((Linha l) -> l.u().getPontos()).reversed()
                        .thenComparing(Comparator.comparingInt(Linha::sequencia).reversed())
                        .thenComparing(l -> l.u().getApelido(), String.CASE_INSENSITIVE_ORDER))
                .toList();

        List<RankingItemDto> ranking = new ArrayList<>();
        for (int i = 0; i < linhas.size(); i++) {
            Usuario u = linhas.get(i).u();
            ranking.add(new RankingItemDto(i + 1, u.getId(), u.getApelido(), u.getFoto(), u.getPontos(),
                    Niveis.nivel(u.getPontos()), linhas.get(i).sequencia(), u.getId().equals(usuarioId)));
        }
        return ranking;
    }

    @Transactional(readOnly = true)
    public List<UsuarioBuscaDto> buscar(Long usuarioId, String termo) {
        String t = termo == null ? "" : termo.trim();
        if (t.length() < 2) {
            return List.of();
        }
        Set<Long> amigos = amizades.findByUsuarioId(usuarioId).stream()
                .map(a -> a.getAmigo().getId()).collect(Collectors.toSet());
        return usuarios.buscar(usuarioId, t, PageRequest.of(0, 20)).stream()
                .map(u -> new UsuarioBuscaDto(u.getId(), u.getApelido(), u.getFoto(), Niveis.nivel(u.getPontos()),
                        amigos.contains(u.getId())))
                .toList();
    }

    /** Adiciona nos dois sentidos, sem precisar de aceite (premissa do projeto). */
    @Transactional
    public void adicionarAmigo(Long usuarioId, Long amigoId) {
        if (usuarioId.equals(amigoId)) {
            throw new Excecoes.RegraNegocio("Você não pode adicionar a si mesmo");
        }
        Usuario eu = progresso.usuario(usuarioId);
        Usuario amigo = usuarios.findById(amigoId)
                .orElseThrow(() -> new Excecoes.NaoEncontrado("Usuário não encontrado"));
        if (amizades.existsByUsuarioIdAndAmigoId(usuarioId, amigoId)) {
            throw new Excecoes.Conflito("Vocês já são amigos");
        }
        Instant agora = relogio.instant();
        amizades.save(new Amizade(eu, amigo, agora));
        if (!amizades.existsByUsuarioIdAndAmigoId(amigoId, usuarioId)) {
            amizades.save(new Amizade(amigo, eu, agora));
        }
    }
}
