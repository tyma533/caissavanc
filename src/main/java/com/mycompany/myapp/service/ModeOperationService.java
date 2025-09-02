package com.mycompany.myapp.service;

import com.mycompany.myapp.service.dto.ModeOperationDTO;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.mycompany.myapp.domain.ModeOperation}.
 */
public interface ModeOperationService {
    /**
     * Save a modeOperation.
     *
     * @param modeOperationDTO the entity to save.
     * @return the persisted entity.
     */
    ModeOperationDTO save(ModeOperationDTO modeOperationDTO);

    /**
     * Updates a modeOperation.
     *
     * @param modeOperationDTO the entity to update.
     * @return the persisted entity.
     */
    ModeOperationDTO update(ModeOperationDTO modeOperationDTO);

    /**
     * Partially updates a modeOperation.
     *
     * @param modeOperationDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ModeOperationDTO> partialUpdate(ModeOperationDTO modeOperationDTO);

    /**
     * Get all the modeOperations.
     *
     * @return the list of entities.
     */
    List<ModeOperationDTO> findAll();

    /**
     * Get the "id" modeOperation.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ModeOperationDTO> findOne(Long id);

    /**
     * Delete the "id" modeOperation.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
