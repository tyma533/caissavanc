package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.PieceJustificatif;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the PieceJustificatif entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PieceJustificatifRepository extends JpaRepository<PieceJustificatif, Long> {}
