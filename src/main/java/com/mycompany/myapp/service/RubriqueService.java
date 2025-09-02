package com.mycompany.myapp.service;

import com.mycompany.myapp.service.dto.RubriqueDTO;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.mycompany.myapp.domain.Rubrique}.
 */
public interface RubriqueService {
    /**
     * Save a rubrique.
     *
     * @param rubriqueDTO the entity to save.
     * @return the persisted entity.
     */
    RubriqueDTO save(RubriqueDTO rubriqueDTO);

    /**
     * Updates a rubrique.
     *
     * @param rubriqueDTO the entity to update.
     * @return the persisted entity.
     */
    RubriqueDTO update(RubriqueDTO rubriqueDTO);

    /**
     * Partially updates a rubrique.
     *
     * @param rubriqueDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<RubriqueDTO> partialUpdate(RubriqueDTO rubriqueDTO);

    /**
     * Get all the rubriques.
     *
     * @return the list of entities.
     */
    List<RubriqueDTO> findAll();

    /**
     * Get the "id" rubrique.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<RubriqueDTO> findOne(Long id);

    /**
     * Delete the "id" rubrique.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
