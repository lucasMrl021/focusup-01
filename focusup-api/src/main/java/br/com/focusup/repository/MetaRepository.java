package br.com.focusup.repository;

import br.com.focusup.domain.Meta;
import br.com.focusup.domain.TipoMeta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MetaRepository extends JpaRepository<Meta, Long> {

    List<Meta> findByUsuarioIdOrderByTipoAsc(Long usuarioId);

    Optional<Meta> findByIdAndUsuarioId(Long id, Long usuarioId);

    Optional<Meta> findByUsuarioIdAndTipo(Long usuarioId, TipoMeta tipo);

    boolean existsByUsuarioIdAndTipo(Long usuarioId, TipoMeta tipo);
}
