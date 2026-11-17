package br.com.focusup.domain;

/** Catálogo de conquistas (RF06). O nome e a dica aparecem na tela 5.3. */
public enum Conquista {
    PRIMEIRA_SESSAO("Primeira sessão", "Você concluiu sua primeira sessão de foco.", "Conclua uma sessão de foco", "foco", "foco"),
    SEQUENCIA_3("3 dias seguidos", "Três dias seguidos com foco.", "Foque 3 dias sem pular", "sequencia", "chama"),
    SEQUENCIA_7("7 dias seguidos", "Uma semana inteira de constância.", "Foque 7 dias sem pular", "sequencia", "chama"),
    META_CUMPRIDA("Meta cumprida", "Você bateu uma meta de estudo.", "Cumpra uma meta diária ou semanal", "metas", "foco"),
    DEZ_HORAS("10 horas de foco", "Dez horas somadas de sessões.", "Some 10 horas de sessões", "foco", "pontos"),
    NIVEL_5("Nível 5", "Você chegou ao nível 5.", "Chegue ao nível 5", "pontos", "palco");

    private final String nome;
    private final String descricao;
    private final String dica;
    private final String icone;
    private final String tom;

    Conquista(String nome, String descricao, String dica, String icone, String tom) {
        this.nome = nome;
        this.descricao = descricao;
        this.dica = dica;
        this.icone = icone;
        this.tom = tom;
    }

    public String getNome() { return nome; }
    public String getDescricao() { return descricao; }
    public String getDica() { return dica; }
    public String getIcone() { return icone; }
    public String getTom() { return tom; }
}
