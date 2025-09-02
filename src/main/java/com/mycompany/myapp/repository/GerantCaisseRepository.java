package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.GerantCaisse;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the GerantCaisse entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GerantCaisseRepository extends JpaRepository<GerantCaisse, Long> {}
