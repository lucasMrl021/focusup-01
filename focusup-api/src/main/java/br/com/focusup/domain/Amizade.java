package br.com.focusup.domain;

import jakarta.persistence.*;

import java.time.Instant;

/**
 * Amizade para o ranking (RF08). Premissa do projeto: adicionar não precisa de aceite,
 * e a amizade vale nos dois sentidos (são gravadas duas linhas).
 */
@Entity
@Table(name = "amizades", uniqueConstraints = @UniqueConstraint(columnNames = {"usuario_id", "amigo_id"}))
public class Amizade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "amigo_id")
    private Usuario amigo;

    @Column(name = "criada_em", nullable = false)
    private Instant criadaEm;

    protected Amizade() {
    }

    public Amizade(Usuario usuario, Usuario amigo, Instant criadaEm) {
        this.usuario = usuario;
        this.amigo = amigo;
        this.criadaEm = criadaEm;
    }

    public Long getId() { return id; }
    public Usuario getUsuario() { return usuario; }
    public Usuario getAmigo() { return amigo; }
    public Instant getCriadaEm() { return criadaEm; }
}
