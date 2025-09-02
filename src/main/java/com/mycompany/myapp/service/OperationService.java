package com.mycompany.myapp.service;

import com.mycompany.myapp.service.dto.OperationDTO;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.mycompany.myapp.domain.Operation}.
 */
public interface OperationService {
    /**
     * Save a operation.
     *
     * @param operationDTO the entity to save.
     * @return the persisted entity.
     */
    OperationDTO save(OperationDTO operationDTO);

    /**
     * Updates a operation.
     *
     * @param operationDTO the entity to update.
     * @return the persisted entity.
     */
    OperationDTO update(OperationDTO operationDTO);

    /**
     * Partially updates a operation.
     *
     * @param operationDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<OperationDTO> partialUpdate(OperationDTO operationDTO);

    /**
     * Get all the operations.
     *
     * @return the list of entities.
     */
    List<OperationDTO> findAll();

    /**
     * Get the "id" operation.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<OperationDTO> findOne(Long id);

    /**
     * Delete the "id" operation.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
