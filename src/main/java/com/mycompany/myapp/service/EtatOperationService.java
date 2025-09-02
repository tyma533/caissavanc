package com.mycompany.myapp.service;

import com.mycompany.myapp.service.dto.EtatOperationDTO;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.mycompany.myapp.domain.EtatOperation}.
 */
public interface EtatOperationService {
    /**
     * Save a etatOperation.
     *
     * @param etatOperationDTO the entity to save.
     * @return the persisted entity.
     */
    EtatOperationDTO save(EtatOperationDTO etatOperationDTO);

    /**
     * Updates a etatOperation.
     *
     * @param etatOperationDTO the entity to update.
     * @return the persisted entity.
     */
    EtatOperationDTO update(EtatOperationDTO etatOperationDTO);

    /**
     * Partially updates a etatOperation.
     *
     * @param etatOperationDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<EtatOperationDTO> partialUpdate(EtatOperationDTO etatOperationDTO);

    /**
     * Get all the etatOperations.
     *
     * @return the list of entities.
     */
    List<EtatOperationDTO> findAll();

    /**
     * Get the "id" etatOperation.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<EtatOperationDTO> findOne(Long id);

    /**
     * Delete the "id" etatOperation.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
