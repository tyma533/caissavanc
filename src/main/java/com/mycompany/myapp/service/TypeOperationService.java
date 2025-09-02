package com.mycompany.myapp.service;

import com.mycompany.myapp.service.dto.TypeOperationDTO;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.mycompany.myapp.domain.TypeOperation}.
 */
public interface TypeOperationService {
    /**
     * Save a typeOperation.
     *
     * @param typeOperationDTO the entity to save.
     * @return the persisted entity.
     */
    TypeOperationDTO save(TypeOperationDTO typeOperationDTO);

    /**
     * Updates a typeOperation.
     *
     * @param typeOperationDTO the entity to update.
     * @return the persisted entity.
     */
    TypeOperationDTO update(TypeOperationDTO typeOperationDTO);

    /**
     * Partially updates a typeOperation.
     *
     * @param typeOperationDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<TypeOperationDTO> partialUpdate(TypeOperationDTO typeOperationDTO);

    /**
     * Get all the typeOperations.
     *
     * @return the list of entities.
     */
    List<TypeOperationDTO> findAll();

    /**
     * Get the "id" typeOperation.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<TypeOperationDTO> findOne(Long id);

    /**
     * Delete the "id" typeOperation.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
