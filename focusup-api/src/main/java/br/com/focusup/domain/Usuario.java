package br.com.focusup.domain;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String nome;

    @Column(nullable = false, unique = true, length = 160)
    private String email;

    /** Senha criptografada com BCrypt (RNF04). Nunca sai da API. */
    @Column(name = "senha_hash", nullable = false, length = 100)
    private String senhaHash;

    @Column(nullable = false, length = 40)
    private String apelido;

    private Integer idade;

    @Column(length = 40)
    private String serie;

    /** Foto como data URI (data:image/jpeg;base64,...). */
    @Lob
    @Column(name = "foto", columnDefinition = "LONGTEXT")
    private String foto;

    @Column(nullable = false)
    private int pontos;

    @Column(name = "criado_em", nullable = false)
    private Instant criadoEm;

    protected Usuario() {
    }

    public Usuario(String nome, String email, String senhaHash, String apelido, Instant criadoEm) {
        this.nome = nome;
        this.email = email;
        this.senhaHash = senhaHash;
        this.apelido = apelido;
        this.criadoEm = criadoEm;
    }

    public void adicionarPontos(int quantidade) {
        this.pontos += quantidade;
    }

    public Long getId() { return id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getEmail() { return email; }
    public String getSenhaHash() { return senhaHash; }
    public String getApelido() { return apelido; }
    public void setApelido(String apelido) { this.apelido = apelido; }
    public Integer getIdade() { return idade; }
    public void setIdade(Integer idade) { this.idade = idade; }
    public String getSerie() { return serie; }
    public void setSerie(String serie) { this.serie = serie; }
    public String getFoto() { return foto; }
    public void setFoto(String foto) { this.foto = foto; }
    public int getPontos() { return pontos; }
    public Instant getCriadoEm() { return criadoEm; }
}
