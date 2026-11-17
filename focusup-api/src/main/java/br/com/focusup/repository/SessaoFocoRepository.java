package br.com.focusup.repository;

import br.com.focusup.domain.SessaoFoco;
import br.com.focusup.domain.StatusSessao;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface SessaoFocoRepository extends JpaRepository<SessaoFoco, Long> {

    Optional<SessaoFoco> findByIdAndUsuarioId(Long id, Long usuarioId);

    List<SessaoFoco> findByUsuarioIdAndStatusOrderByFimDesc(Long usuarioId, StatusSessao status, Pageable pageable);

    long countByUsuarioIdAndStatus(Long usuarioId, StatusSessao status);

    long countByUsuarioIdAndStatusAndDia(Long usuarioId, StatusSessao status, LocalDate dia);

    @Query("""
            select distinct s.dia from SessaoFoco s
            where s.usuario.id = :usuarioId and s.status = br.com.focusup.domain.StatusSessao.CONCLUIDA
            """)
    List<LocalDate> diasComFoco(@Param("usuarioId") Long usuarioId);

    @Query("""
            select coalesce(sum(s.duracaoMinutos), 0) from SessaoFoco s
            where s.usuario.id = :usuarioId and s.status = br.com.focusup.domain.StatusSessao.CONCLUIDA
              and s.dia between :de and :ate
            """)
    long minutosEntre(@Param("usuarioId") Long usuarioId, @Param("de") LocalDate de, @Param("ate") LocalDate ate);

    @Query("""
            select coalesce(sum(s.duracaoMinutos), 0) from SessaoFoco s
            where s.usuario.id = :usuarioId and s.status = br.com.focusup.domain.StatusSessao.CONCLUIDA
            """)
    long minutosTotais(@Param("usuarioId") Long usuarioId);

    @Query("""
            select s from SessaoFoco s
            where s.usuario.id = :usuarioId and s.status = br.com.focusup.domain.StatusSessao.CONCLUIDA
              and s.dia between :de and :ate
            """)
    List<SessaoFoco> concluidasEntre(@Param("usuarioId") Long usuarioId, @Param("de") LocalDate de, @Param("ate") LocalDate ate);
}
