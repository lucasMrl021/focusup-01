package br.com.focusup.domain;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "conquistas_usuario", uniqueConstraints = @UniqueConstraint(columnNames = {"usuario_id", "conquista"}))
public class ConquistaUsuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Conquista conquista;

    @Column(name = "conquistada_em", nullable = false)
    private Instant conquistadaEm;

    protected ConquistaUsuario() {
    }

    public ConquistaUsuario(Usuario usuario, Conquista conquista, Instant conquistadaEm) {
        this.usuario = usuario;
        this.conquista = conquista;
        this.conquistadaEm = conquistadaEm;
    }

    public Long getId() { return id; }
    public Usuario getUsuario() { return usuario; }
    public Conquista getConquista() { return conquista; }
    public Instant getConquistadaEm() { return conquistadaEm; }
}
