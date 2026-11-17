package br.com.focusup.domain;

import jakarta.persistence.*;

import java.time.Instant;

/** Meta de tempo de estudo (RF03). Cada usuário tem no máximo uma meta de cada tipo. */
@Entity
@Table(name = "metas", uniqueConstraints = @UniqueConstraint(columnNames = {"usuario_id", "tipo"}))
public class Meta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private TipoMeta tipo;

    @Column(name = "minutos_alvo", nullable = false)
    private int minutosAlvo;

    @Column(name = "criada_em", nullable = false)
    private Instant criadaEm;

    protected Meta() {
    }

    public Meta(Usuario usuario, TipoMeta tipo, int minutosAlvo, Instant criadaEm) {
        this.usuario = usuario;
        this.tipo = tipo;
        this.minutosAlvo = minutosAlvo;
        this.criadaEm = criadaEm;
    }

    public Long getId() { return id; }
    public Usuario getUsuario() { return usuario; }
    public TipoMeta getTipo() { return tipo; }
    public void setTipo(TipoMeta tipo) { this.tipo = tipo; }
    public int getMinutosAlvo() { return minutosAlvo; }
    public void setMinutosAlvo(int minutosAlvo) { this.minutosAlvo = minutosAlvo; }
    public Instant getCriadaEm() { return criadaEm; }
}
