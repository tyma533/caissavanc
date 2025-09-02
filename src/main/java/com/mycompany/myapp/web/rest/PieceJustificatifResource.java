package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.repository.PieceJustificatifRepository;
import com.mycompany.myapp.service.PieceJustificatifService;
import com.mycompany.myapp.service.dto.PieceJustificatifDTO;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.PieceJustificatif}.
 */
@RestController
@RequestMapping("/api/piece-justificatifs")
public class PieceJustificatifResource {

    private final Logger log = LoggerFactory.getLogger(PieceJustificatifResource.class);

    private static final String ENTITY_NAME = "pieceJustificatif";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PieceJustificatifService pieceJustificatifService;

    private final PieceJustificatifRepository pieceJustificatifRepository;

    public PieceJustificatifResource(
        PieceJustificatifService pieceJustificatifService,
        PieceJustificatifRepository pieceJustificatifRepository
    ) {
        this.pieceJustificatifService = pieceJustificatifService;
        this.pieceJustificatifRepository = pieceJustificatifRepository;
    }

    /**
     * {@code POST  /piece-justificatifs} : Create a new pieceJustificatif.
     *
     * @param pieceJustificatifDTO the pieceJustificatifDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new pieceJustificatifDTO, or with status {@code 400 (Bad Request)} if the pieceJustificatif has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<PieceJustificatifDTO> createPieceJustificatif(@RequestBody PieceJustificatifDTO pieceJustificatifDTO)
        throws URISyntaxException {
        log.debug("REST request to save PieceJustificatif : {}", pieceJustificatifDTO);
        if (pieceJustificatifDTO.getId() != null) {
            throw new BadRequestAlertException("A new pieceJustificatif cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PieceJustificatifDTO result = pieceJustificatifService.save(pieceJustificatifDTO);
        return ResponseEntity
            .created(new URI("/api/piece-justificatifs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /piece-justificatifs/:id} : Updates an existing pieceJustificatif.
     *
     * @param id the id of the pieceJustificatifDTO to save.
     * @param pieceJustificatifDTO the pieceJustificatifDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated pieceJustificatifDTO,
     * or with status {@code 400 (Bad Request)} if the pieceJustificatifDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the pieceJustificatifDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<PieceJustificatifDTO> updatePieceJustificatif(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody PieceJustificatifDTO pieceJustificatifDTO
    ) throws URISyntaxException {
        log.debug("REST request to update PieceJustificatif : {}, {}", id, pieceJustificatifDTO);
        if (pieceJustificatifDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, pieceJustificatifDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!pieceJustificatifRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        PieceJustificatifDTO result = pieceJustificatifService.update(pieceJustificatifDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, pieceJustificatifDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /piece-justificatifs/:id} : Partial updates given fields of an existing pieceJustificatif, field will ignore if it is null
     *
     * @param id the id of the pieceJustificatifDTO to save.
     * @param pieceJustificatifDTO the pieceJustificatifDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated pieceJustificatifDTO,
     * or with status {@code 400 (Bad Request)} if the pieceJustificatifDTO is not valid,
     * or with status {@code 404 (Not Found)} if the pieceJustificatifDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the pieceJustificatifDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<PieceJustificatifDTO> partialUpdatePieceJustificatif(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody PieceJustificatifDTO pieceJustificatifDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update PieceJustificatif partially : {}, {}", id, pieceJustificatifDTO);
        if (pieceJustificatifDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, pieceJustificatifDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!pieceJustificatifRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<PieceJustificatifDTO> result = pieceJustificatifService.partialUpdate(pieceJustificatifDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, pieceJustificatifDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /piece-justificatifs} : get all the pieceJustificatifs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of pieceJustificatifs in body.
     */
    @GetMapping("")
    public List<PieceJustificatifDTO> getAllPieceJustificatifs() {
        log.debug("REST request to get all PieceJustificatifs");
        return pieceJustificatifService.findAll();
    }

    /**
     * {@code GET  /piece-justificatifs/:id} : get the "id" pieceJustificatif.
     *
     * @param id the id of the pieceJustificatifDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the pieceJustificatifDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<PieceJustificatifDTO> getPieceJustificatif(@PathVariable Long id) {
        log.debug("REST request to get PieceJustificatif : {}", id);
        Optional<PieceJustificatifDTO> pieceJustificatifDTO = pieceJustificatifService.findOne(id);
        return ResponseUtil.wrapOrNotFound(pieceJustificatifDTO);
    }

    /**
     * {@code DELETE  /piece-justificatifs/:id} : delete the "id" pieceJustificatif.
     *
     * @param id the id of the pieceJustificatifDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePieceJustificatif(@PathVariable Long id) {
        log.debug("REST request to delete PieceJustificatif : {}", id);
        pieceJustificatifService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
