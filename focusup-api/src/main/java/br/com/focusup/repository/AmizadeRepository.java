package br.com.focusup.repository;

import br.com.focusup.domain.Amizade;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AmizadeRepository extends JpaRepository<Amizade, Long> {

    List<Amizade> findByUsuarioId(Long usuarioId);

    boolean existsByUsuarioIdAndAmigoId(Long usuarioId, Long amigoId);
}
