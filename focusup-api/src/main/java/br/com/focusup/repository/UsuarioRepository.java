package br.com.focusup.repository;

import br.com.focusup.domain.Usuario;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    @Query("""
            select u from Usuario u
            where u.id <> :usuarioId
              and (lower(u.apelido) like lower(concat('%', :termo, '%')) or lower(u.email) = lower(:termo))
            order by u.apelido
            """)
    List<Usuario> buscar(@Param("usuarioId") Long usuarioId, @Param("termo") String termo, Pageable pageable);
}
