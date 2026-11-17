package br.com.focusup.service;

import br.com.focusup.domain.*;
import br.com.focusup.repository.ConquistaUsuarioRepository;
import br.com.focusup.repository.MetaRepository;
import br.com.focusup.repository.SessaoFocoRepository;
import br.com.focusup.repository.UsuarioRepository;
import br.com.focusup.rules.Niveis;
import br.com.focusup.rules.RegrasConquista;
import br.com.focusup.rules.Sequencias;
import br.com.focusup.web.dto.Dtos.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

/** Calcula metas, sequência, nível, conquistas e estatísticas (RF03, RF05, RF06, RF07). */
@Service
public class ProgressoService {

    private final UsuarioRepository usuarios;
    private final MetaRepository metas;
    private final SessaoFocoRepository sessoes;
    private final ConquistaUsuarioRepository conquistas;
    private final Clock relogio;

    public ProgressoService(UsuarioRepository usuarios, MetaRepository metas, SessaoFocoRepository sessoes,
                            ConquistaUsuarioRepository conquistas, Clock relogio) {
        this.usuarios = usuarios;
        this.metas = metas;
        this.sessoes = sessoes;
        this.conquistas = conquistas;
        this.relogio = relogio;
    }

    public LocalDate hoje() {
        return LocalDate.now(relogio);
    }

    public Usuario usuario(Long usuarioId) {
        return usuarios.findById(usuarioId).orElseThrow(() -> new Excecoes.NaoEncontrado("Usuário não encontrado"));
    }

    @Transactional(readOnly = true)
    public SequenciaDto sequencia(Long usuarioId) {
        List<LocalDate> dias = sessoes.diasComFoco(usuarioId);
        LocalDate hoje = hoje();
        Sequencias.Resultado r = Sequencias.calcular(dias, hoje);
        return new SequenciaDto(r.atual(), r.melhor(), Sequencias.semana(dias, hoje), Sequencias.indiceDoDia(hoje));
    }

    public MetaDto progressoDaMeta(Meta meta) {
        LocalDate hoje = hoje();
        LocalDate de = meta.getTipo() == TipoMeta.DIARIA ? hoje : Sequencias.inicioDaSemana(hoje);
        long feitos = sessoes.minutosEntre(meta.getUsuario().getId(), de, hoje);
        return new MetaDto(meta.getId(), meta.getTipo(), meta.getMinutosAlvo(), feitos, feitos >= meta.getMinutosAlvo());
    }

    /** A meta mostrada em Início: a diária, se houver; senão a semanal. */
    @Transactional(readOnly = true)
    public MetaDto metaDeHoje(Long usuarioId) {
        return metas.findByUsuarioIdOrderByTipoAsc(usuarioId).stream()
                .findFirst()
                .map(this::progressoDaMeta)
                .orElse(null);
    }

    @Transactional(readOnly = true)
    public InicioDto inicio(Long usuarioId) {
        Usuario u = usuario(usuarioId);
        List<SessaoDto> ultimas = sessoes
                .findByUsuarioIdAndStatusOrderByFimDesc(usuarioId, StatusSessao.CONCLUIDA, PageRequest.of(0, 3))
                .stream().map(Mapeador::sessao).toList();
        return new InicioDto(u.getApelido(), u.getFoto(), Mapeador.nivel(u.getPontos()), sequencia(usuarioId),
                metaDeHoje(usuarioId), ultimas);
    }

    @Transactional(readOnly = true)
    public ConquistasDto conquistas(Long usuarioId) {
        Usuario u = usuario(usuarioId);
        Map<Conquista, Instant> obtidas = conquistas.findByUsuarioId(usuarioId).stream()
                .collect(Collectors.toMap(ConquistaUsuario::getConquista, ConquistaUsuario::getConquistadaEm));
        List<ConquistaDto> lista = Arrays.stream(Conquista.values())
                .map(c -> Mapeador.conquista(c, obtidas.get(c)))
                .toList();
        return new ConquistasDto(Mapeador.nivel(u.getPontos()), sequencia(usuarioId), lista);
    }

    /** Grava as conquistas que o usuário passou a merecer e devolve só as novas. */
    @Transactional
    public List<Conquista> registrarNovasConquistas(Usuario u, int sequenciaAtual) {
        Long id = u.getId();
        boolean metaCumprida = metas.findByUsuarioIdOrderByTipoAsc(id).stream()
                .map(this::progressoDaMeta)
                .anyMatch(MetaDto::cumprida);
        var situacao = new RegrasConquista.Situacao(
                sessoes.countByUsuarioIdAndStatus(id, StatusSessao.CONCLUIDA),
                sequenciaAtual,
                metaCumprida,
                sessoes.minutosTotais(id),
                Niveis.nivel(u.getPontos()));
        Set<Conquista> ja = conquistas.findByUsuarioId(id).stream()
                .map(ConquistaUsuario::getConquista)
                .collect(Collectors.toCollection(() -> EnumSet.noneOf(Conquista.class)));
        Set<Conquista> novas = RegrasConquista.novas(situacao, ja);
        Instant agora = relogio.instant();
        novas.forEach(c -> conquistas.save(new ConquistaUsuario(u, c, agora)));
        return new ArrayList<>(novas);
    }

    /** SEMANA = últimos 7 dias; MES = últimos 30 dias, ambos terminando hoje. */
    @Transactional(readOnly = true)
    public EstatisticasDto estatisticas(Long usuarioId, String periodo) {
        String p = periodo == null ? "SEMANA" : periodo.toUpperCase(Locale.ROOT);
        int quantidadeDias = switch (p) {
            case "SEMANA" -> 7;
            case "MES" -> 30;
            default -> throw new Excecoes.RegraNegocio("Período inválido. Use SEMANA ou MES.");
        };
        LocalDate ate = hoje();
        LocalDate de = ate.minusDays(quantidadeDias - 1L);
        List<SessaoFoco> lista = sessoes.concluidasEntre(usuarioId, de, ate);
        Map<LocalDate, Long> porDia = lista.stream()
                .collect(Collectors.groupingBy(SessaoFoco::getDia, Collectors.summingLong(SessaoFoco::getDuracaoMinutos)));
        List<MinutosDoDiaDto> dias = new ArrayList<>();
        for (LocalDate d = de; !d.isAfter(ate); d = d.plusDays(1)) {
            dias.add(new MinutosDoDiaDto(d, porDia.getOrDefault(d, 0L)));
        }
        Integer metaDiaria = metas.findByUsuarioIdAndTipo(usuarioId, TipoMeta.DIARIA)
                .map(Meta::getMinutosAlvo).orElse(null);
        long total = porDia.values().stream().mapToLong(Long::longValue).sum();
        return new EstatisticasDto(p, total, lista.size(), metaDiaria, dias);
    }

}
