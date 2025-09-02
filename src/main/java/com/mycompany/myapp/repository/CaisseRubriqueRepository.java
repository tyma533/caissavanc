package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.CaisseRubrique;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the CaisseRubrique entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CaisseRubriqueRepository extends JpaRepository<CaisseRubrique, Long> {}
