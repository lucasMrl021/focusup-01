package br.com.focusup.service;

import br.com.focusup.domain.Conquista;
import br.com.focusup.domain.SessaoFoco;
import br.com.focusup.domain.StatusSessao;
import br.com.focusup.domain.Usuario;
import br.com.focusup.repository.SessaoFocoRepository;
import br.com.focusup.rules.Niveis;
import br.com.focusup.rules.Pontuacao;
import br.com.focusup.web.dto.Dtos.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

/** Sessões de foco (RF04) e os pontos que elas geram (RF05). */
@Service
public class SessaoService {

    public static final Set<Integer> DURACOES_PERMITIDAS = Set.of(15, 25, 45, 60);

    private final SessaoFocoRepository sessoes;
    private final ProgressoService progresso;
    private final Clock relogio;
    private final boolean validarTempo;
    private final long toleranciaSegundos;

    public SessaoService(SessaoFocoRepository sessoes, ProgressoService progresso, Clock relogio,
                         @Value("${focusup.sessao.validar-tempo:true}") boolean validarTempo,
                         @Value("${focusup.sessao.tolerancia-segundos:10}") long toleranciaSegundos) {
        this.sessoes = sessoes;
        this.progresso = progresso;
        this.relogio = relogio;
        this.validarTempo = validarTempo;
        this.toleranciaSegundos = toleranciaSegundos;
    }

    @Transactional
    public SessaoDto iniciar(Long usuarioId, int duracaoMinutos) {
        if (!DURACOES_PERMITIDAS.contains(duracaoMinutos)) {
            throw new Excecoes.RegraNegocio("Escolha 15, 25, 45 ou 60 minutos");
        }
        Usuario u = progresso.usuario(usuarioId);
        return Mapeador.sessao(sessoes.save(new SessaoFoco(u, duracaoMinutos, relogio.instant())));
    }

    @Transactional
    public ResultadoSessaoDto concluir(Long usuarioId, Long sessaoId) {
        SessaoFoco sessao = emAndamento(usuarioId, sessaoId);
        Instant agora = relogio.instant();
        long decorrido = Duration.between(sessao.getInicio(), agora).getSeconds();
        if (validarTempo && decorrido + toleranciaSegundos < sessao.getDuracaoMinutos() * 60L) {
            throw new Excecoes.RegraNegocio("A sessão ainda não terminou");
        }

        Usuario u = sessao.getUsuario();
        LocalDate hoje = progresso.hoje();
        boolean primeiraDoDia = sessoes.countByUsuarioIdAndStatusAndDia(usuarioId, StatusSessao.CONCLUIDA, hoje) == 0;
        int nivelAntes = Niveis.nivel(u.getPontos());

        sessao.concluir(agora, hoje, Pontuacao.PONTOS_POR_SESSAO);
        sessoes.saveAndFlush(sessao);

        SequenciaDto sequencia = progresso.sequencia(usuarioId);
        int bonus = Pontuacao.bonusConstancia(sequencia.atual(), primeiraDoDia);
        u.adicionarPontos(Pontuacao.PONTOS_POR_SESSAO + bonus);

        List<Conquista> novas = progresso.registrarNovasConquistas(u, sequencia.atual());
        NivelDto nivel = Mapeador.nivel(u.getPontos());
        return new ResultadoSessaoDto(
                Mapeador.sessao(sessao),
                Pontuacao.PONTOS_POR_SESSAO,
                bonus,
                nivel,
                nivel.nivel() > nivelAntes,
                sequencia,
                progresso.metaDeHoje(usuarioId),
                novas.stream().map(c -> Mapeador.conquista(c, agora)).toList());
    }

    /** Encerrar antes do fim: não gera pontos e não bloqueia nada. */
    @Transactional
    public void encerrar(Long usuarioId, Long sessaoId) {
        emAndamento(usuarioId, sessaoId).encerrar(relogio.instant());
    }

    @Transactional(readOnly = true)
    public List<SessaoDto> historico(Long usuarioId, int limite) {
        int tamanho = Math.max(1, Math.min(limite, 200));
        return sessoes.findByUsuarioIdAndStatusOrderByFimDesc(usuarioId, StatusSessao.CONCLUIDA, PageRequest.of(0, tamanho))
                .stream().map(Mapeador::sessao).toList();
    }

    private SessaoFoco emAndamento(Long usuarioId, Long sessaoId) {
        SessaoFoco sessao = sessoes.findByIdAndUsuarioId(sessaoId, usuarioId)
                .orElseThrow(() -> new Excecoes.NaoEncontrado("Sessão não encontrada"));
        if (sessao.getStatus() != StatusSessao.EM_ANDAMENTO) {
            throw new Excecoes.Conflito("Esta sessão já foi finalizada");
        }
        return sessao;
    }
}
