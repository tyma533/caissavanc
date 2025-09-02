package com.mycompany.myapp.service;

import com.mycompany.myapp.service.dto.AgentEtatProfilDTO;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.mycompany.myapp.domain.AgentEtatProfil}.
 */
public interface AgentEtatProfilService {
    /**
     * Save a agentEtatProfil.
     *
     * @param agentEtatProfilDTO the entity to save.
     * @return the persisted entity.
     */
    AgentEtatProfilDTO save(AgentEtatProfilDTO agentEtatProfilDTO);

    /**
     * Updates a agentEtatProfil.
     *
     * @param agentEtatProfilDTO the entity to update.
     * @return the persisted entity.
     */
    AgentEtatProfilDTO update(AgentEtatProfilDTO agentEtatProfilDTO);

    /**
     * Partially updates a agentEtatProfil.
     *
     * @param agentEtatProfilDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<AgentEtatProfilDTO> partialUpdate(AgentEtatProfilDTO agentEtatProfilDTO);

    /**
     * Get all the agentEtatProfils.
     *
     * @return the list of entities.
     */
    List<AgentEtatProfilDTO> findAll();

    /**
     * Get the "id" agentEtatProfil.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<AgentEtatProfilDTO> findOne(Long id);

    /**
     * Delete the "id" agentEtatProfil.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
