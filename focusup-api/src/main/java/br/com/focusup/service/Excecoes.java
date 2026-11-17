package br.com.focusup.service;

/** Erros de negócio. O {@code ApiExceptionHandler} transforma cada um no status HTTP certo. */
public final class Excecoes {

    private Excecoes() {
    }

    /** 404 */
    public static class NaoEncontrado extends RuntimeException {
        public NaoEncontrado(String mensagem) { super(mensagem); }
    }

    /** 409 */
    public static class Conflito extends RuntimeException {
        public Conflito(String mensagem) { super(mensagem); }
    }

    /** 400 */
    public static class RegraNegocio extends RuntimeException {
        public RegraNegocio(String mensagem) { super(mensagem); }
    }

    /** 401 */
    public static class CredenciaisInvalidas extends RuntimeException {
        public CredenciaisInvalidas() { super("E-mail ou senha incorretos"); }
    }
}
