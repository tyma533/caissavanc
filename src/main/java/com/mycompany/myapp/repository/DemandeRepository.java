package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Demande;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Demande entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DemandeRepository extends JpaRepository<Demande, Long> {
    @EntityGraph(attributePaths = "etablissement")
    Optional<Demande> findById(Long id);

    List<Demande> findByCaisseId(Long caisseId);
    List<Demande> findByCaisseIdAndType(Long caisseId, com.mycompany.myapp.domain.enumeration.Type type);
}
