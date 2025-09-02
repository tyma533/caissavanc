package com.mycompany.myapp.service;

import com.mycompany.myapp.service.dto.CaisseRubriqueDTO;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.mycompany.myapp.domain.CaisseRubrique}.
 */
public interface CaisseRubriqueService {
    /**
     * Save a caisseRubrique.
     *
     * @param caisseRubriqueDTO the entity to save.
     * @return the persisted entity.
     */
    CaisseRubriqueDTO save(CaisseRubriqueDTO caisseRubriqueDTO);

    /**
     * Updates a caisseRubrique.
     *
     * @param caisseRubriqueDTO the entity to update.
     * @return the persisted entity.
     */
    CaisseRubriqueDTO update(CaisseRubriqueDTO caisseRubriqueDTO);

    /**
     * Partially updates a caisseRubrique.
     *
     * @param caisseRubriqueDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<CaisseRubriqueDTO> partialUpdate(CaisseRubriqueDTO caisseRubriqueDTO);

    /**
     * Get all the caisseRubriques.
     *
     * @return the list of entities.
     */
    List<CaisseRubriqueDTO> findAll();

    /**
     * Get the "id" caisseRubrique.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<CaisseRubriqueDTO> findOne(Long id);

    /**
     * Delete the "id" caisseRubrique.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
