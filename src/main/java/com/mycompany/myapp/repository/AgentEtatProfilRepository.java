package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.AgentEtatProfil;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the AgentEtatProfil entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AgentEtatProfilRepository extends JpaRepository<AgentEtatProfil, Long> {}
