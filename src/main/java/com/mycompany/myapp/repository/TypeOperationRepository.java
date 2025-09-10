package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Demande;
import com.mycompany.myapp.domain.TypeOperation;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the TypeOperation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TypeOperationRepository extends JpaRepository<TypeOperation, Long> {
    Optional<Demande> findByLibelle(String string);
}
