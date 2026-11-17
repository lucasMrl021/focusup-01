package br.com.focusup.repository;

import br.com.focusup.domain.ConquistaUsuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConquistaUsuarioRepository extends JpaRepository<ConquistaUsuario, Long> {

    List<ConquistaUsuario> findByUsuarioId(Long usuarioId);
}
