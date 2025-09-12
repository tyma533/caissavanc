package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ModeOperation;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ModeOperation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ModeOperationRepository extends JpaRepository<ModeOperation, Long> {
    Optional<ModeOperation> findByLibelle(String libelle);
}
