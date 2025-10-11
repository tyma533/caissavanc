package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Operation;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Operation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OperationRepository extends JpaRepository<Operation, Long> {
    List<Operation> findByCaisseId(Long caisseId);
    List<Operation> findByCaisseIdAndTypeOperationLibelle(Long caisseId, String libelle);
}
