package com.mycompany.myapp.service;

import com.mycompany.myapp.service.dto.ControleDTO;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.mycompany.myapp.domain.Controle}.
 */
public interface ControleService {
    /**
     * Save a controle.
     *
     * @param controleDTO the entity to save.
     * @return the persisted entity.
     */
    ControleDTO save(ControleDTO controleDTO);

    /**
     * Updates a controle.
     *
     * @param controleDTO the entity to update.
     * @return the persisted entity.
     */
    ControleDTO update(ControleDTO controleDTO);

    /**
     * Partially updates a controle.
     *
     * @param controleDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ControleDTO> partialUpdate(ControleDTO controleDTO);

    /**
     * Get all the controles.
     *
     * @return the list of entities.
     */
    List<ControleDTO> findAll();

    /**
     * Get the "id" controle.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ControleDTO> findOne(Long id);

    /**
     * Delete the "id" controle.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
