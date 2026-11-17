package br.com.focusup.web;

import br.com.focusup.service.Excecoes;
import br.com.focusup.web.dto.Dtos.ErroDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.List;

/** Transforma erros em respostas JSON {"mensagem": "..."} com o status certo. */
@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(Excecoes.NaoEncontrado.class)
    ResponseEntity<ErroDto> naoEncontrado(Excecoes.NaoEncontrado e) {
        return erro(HttpStatus.NOT_FOUND, e.getMessage());
    }

    @ExceptionHandler(Excecoes.Conflito.class)
    ResponseEntity<ErroDto> conflito(Excecoes.Conflito e) {
        return erro(HttpStatus.CONFLICT, e.getMessage());
    }

    @ExceptionHandler(Excecoes.RegraNegocio.class)
    ResponseEntity<ErroDto> regra(Excecoes.RegraNegocio e) {
        return erro(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    @ExceptionHandler(Excecoes.CredenciaisInvalidas.class)
    ResponseEntity<ErroDto> credenciais(Excecoes.CredenciaisInvalidas e) {
        return erro(HttpStatus.UNAUTHORIZED, e.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ErroDto> validacao(MethodArgumentNotValidException e) {
        List<String> detalhes = e.getBindingResult().getFieldErrors().stream()
                .map(f -> f.getField() + ": " + f.getDefaultMessage())
                .toList();
        String primeira = e.getBindingResult().getFieldErrors().isEmpty()
                ? "Dados inválidos"
                : e.getBindingResult().getFieldErrors().get(0).getDefaultMessage();
        return ResponseEntity.badRequest().body(new ErroDto(primeira, detalhes));
    }

    @ExceptionHandler({HttpMessageNotReadableException.class, MethodArgumentTypeMismatchException.class})
    ResponseEntity<ErroDto> corpoInvalido(Exception e) {
        return erro(HttpStatus.BAD_REQUEST, "Dados inválidos");
    }

    private static ResponseEntity<ErroDto> erro(HttpStatus status, String mensagem) {
        return ResponseEntity.status(status).body(new ErroDto(mensagem, List.of()));
    }
}
