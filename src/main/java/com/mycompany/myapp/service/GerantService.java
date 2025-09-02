package com.mycompany.myapp.service;

import com.mycompany.myapp.service.dto.GerantDTO;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.mycompany.myapp.domain.Gerant}.
 */
public interface GerantService {
    /**
     * Save a gerant.
     *
     * @param gerantDTO the entity to save.
     * @return the persisted entity.
     */
    GerantDTO save(GerantDTO gerantDTO);

    /**
     * Updates a gerant.
     *
     * @param gerantDTO the entity to update.
     * @return the persisted entity.
     */
    GerantDTO update(GerantDTO gerantDTO);

    /**
     * Partially updates a gerant.
     *
     * @param gerantDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<GerantDTO> partialUpdate(GerantDTO gerantDTO);

    /**
     * Get all the gerants.
     *
     * @return the list of entities.
     */
    List<GerantDTO> findAll();

    /**
     * Get the "id" gerant.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<GerantDTO> findOne(Long id);

    /**
     * Delete the "id" gerant.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
