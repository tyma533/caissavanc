package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Gerant;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Gerant entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GerantRepository extends JpaRepository<Gerant, Long> {}
