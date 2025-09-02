package com.mycompany.myapp.service;

import com.mycompany.myapp.service.dto.PieceJustificatifDTO;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.mycompany.myapp.domain.PieceJustificatif}.
 */
public interface PieceJustificatifService {
    /**
     * Save a pieceJustificatif.
     *
     * @param pieceJustificatifDTO the entity to save.
     * @return the persisted entity.
     */
    PieceJustificatifDTO save(PieceJustificatifDTO pieceJustificatifDTO);

    /**
     * Updates a pieceJustificatif.
     *
     * @param pieceJustificatifDTO the entity to update.
     * @return the persisted entity.
     */
    PieceJustificatifDTO update(PieceJustificatifDTO pieceJustificatifDTO);

    /**
     * Partially updates a pieceJustificatif.
     *
     * @param pieceJustificatifDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<PieceJustificatifDTO> partialUpdate(PieceJustificatifDTO pieceJustificatifDTO);

    /**
     * Get all the pieceJustificatifs.
     *
     * @return the list of entities.
     */
    List<PieceJustificatifDTO> findAll();

    /**
     * Get the "id" pieceJustificatif.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<PieceJustificatifDTO> findOne(Long id);

    /**
     * Delete the "id" pieceJustificatif.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
