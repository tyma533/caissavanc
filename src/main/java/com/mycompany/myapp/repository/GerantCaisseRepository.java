package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.GerantCaisse;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the GerantCaisse entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GerantCaisseRepository extends JpaRepository<GerantCaisse, Long> {
    Optional<GerantCaisse> findFirstByCaisseIdAndActifTrue(Long caisseId);

    public List<GerantCaisse> findByCaisseIdAndActifTrue(Long caisseId);
}
