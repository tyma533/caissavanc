package com.mycompany.myapp.service;

import com.mycompany.myapp.service.dto.CaisseDTO;
import com.mycompany.myapp.service.dto.CaisseRubriqueDTO;
import com.mycompany.myapp.service.dto.RubriqueDTO;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.mycompany.myapp.domain.Caisse}.
 */
public interface CaisseService {
    /**
     * Save a caisse.
     *
     * @param caisseDTO the entity to save.
     * @return the persisted entity.
     */
    CaisseDTO save(CaisseDTO caisseDTO);

    /**
     * Updates a caisse.
     *
     * @param caisseDTO the entity to update.
     * @return the persisted entity.
     */
    CaisseDTO update(CaisseDTO caisseDTO);

    /**
     * Partially updates a caisse.
     *
     * @param caisseDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<CaisseDTO> partialUpdate(CaisseDTO caisseDTO);

    /**
     * Get all the caisses.
     *
     * @return the list of entities.
     */
    List<CaisseDTO> findAll();

    /**
     * Get the "id" caisse.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<CaisseDTO> findOne(Object id);

    /**
     * Delete the "id" caisse.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    List<CaisseDTO> findByEtablissementId(Long etablissementId);

    Optional<CaisseDTO> findOne(Long caisseId);

    void affecterRubrique(Long caisseId, Long rubriqueId);

    void desaffecterRubrique(Long caisseId, Long rubriqueId);

    List<RubriqueDTO> getRubriquesAffectees(Long caisseId);

    List<RubriqueDTO> getRubriquesNonAffectees(Long caisseId);

    CaisseRubriqueDTO affecterRubriqueALaCaisse(Long caisseId, Long rubriqueId);
    List<CaisseDTO> findAllFiltered(String libelle, String etablissement);
}
