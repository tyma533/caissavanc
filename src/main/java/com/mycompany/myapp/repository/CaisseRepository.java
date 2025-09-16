package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Caisse;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Caisse entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CaisseRepository extends JpaRepository<Caisse, Long> {
    List<Caisse> findByEtablissementId(Long etablissementId);
    List<Caisse> findByLibelleContainingIgnoreCaseAndEtablissement_LibelleContainingIgnoreCase(String libelle, String etablissement);
}
