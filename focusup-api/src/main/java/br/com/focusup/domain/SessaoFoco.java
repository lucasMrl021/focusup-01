package br.com.focusup.domain;

import jakarta.persistence.*;

import java.time.Instant;
import java.time.LocalDate;

/** Sessão de foco no estilo Pomodoro (RF04). */
@Entity
@Table(name = "sessoes_foco", indexes = @Index(name = "idx_sessao_usuario_dia", columnList = "usuario_id, dia"))
public class SessaoFoco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Column(name = "duracao_minutos", nullable = false)
    private int duracaoMinutos;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    private StatusSessao status;

    @Column(nullable = false)
    private Instant inicio;

    private Instant fim;

    /** Dia (no fuso do app) em que a sessão foi concluída. Usado em metas, sequências e estatísticas. */
    private LocalDate dia;

    @Column(nullable = false)
    private int pontos;

    protected SessaoFoco() {
    }

    public SessaoFoco(Usuario usuario, int duracaoMinutos, Instant inicio) {
        this.usuario = usuario;
        this.duracaoMinutos = duracaoMinutos;
        this.inicio = inicio;
        this.status = StatusSessao.EM_ANDAMENTO;
    }

    public void concluir(Instant fim, LocalDate dia, int pontos) {
        this.status = StatusSessao.CONCLUIDA;
        this.fim = fim;
        this.dia = dia;
        this.pontos = pontos;
    }

    public void encerrar(Instant fim) {
        this.status = StatusSessao.ENCERRADA;
        this.fim = fim;
        this.pontos = 0;
    }

    public Long getId() { return id; }
    public Usuario getUsuario() { return usuario; }
    public int getDuracaoMinutos() { return duracaoMinutos; }
    public StatusSessao getStatus() { return status; }
    public Instant getInicio() { return inicio; }
    public Instant getFim() { return fim; }
    public LocalDate getDia() { return dia; }
    public int getPontos() { return pontos; }
}
