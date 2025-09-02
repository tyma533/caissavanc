package com.mycompany.myapp.service;

import com.mycompany.myapp.service.dto.GerantCaisseDTO;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.mycompany.myapp.domain.GerantCaisse}.
 */
public interface GerantCaisseService {
    /**
     * Save a gerantCaisse.
     *
     * @param gerantCaisseDTO the entity to save.
     * @return the persisted entity.
     */
    GerantCaisseDTO save(GerantCaisseDTO gerantCaisseDTO);

    /**
     * Updates a gerantCaisse.
     *
     * @param gerantCaisseDTO the entity to update.
     * @return the persisted entity.
     */
    GerantCaisseDTO update(GerantCaisseDTO gerantCaisseDTO);

    /**
     * Partially updates a gerantCaisse.
     *
     * @param gerantCaisseDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<GerantCaisseDTO> partialUpdate(GerantCaisseDTO gerantCaisseDTO);

    /**
     * Get all the gerantCaisses.
     *
     * @return the list of entities.
     */
    List<GerantCaisseDTO> findAll();

    /**
     * Get the "id" gerantCaisse.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<GerantCaisseDTO> findOne(Long id);

    /**
     * Delete the "id" gerantCaisse.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
