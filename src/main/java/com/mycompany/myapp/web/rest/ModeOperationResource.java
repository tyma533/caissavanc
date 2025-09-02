package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.repository.ModeOperationRepository;
import com.mycompany.myapp.service.ModeOperationService;
import com.mycompany.myapp.service.dto.ModeOperationDTO;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.ModeOperation}.
 */
@RestController
@RequestMapping("/api/mode-operations")
public class ModeOperationResource {

    private final Logger log = LoggerFactory.getLogger(ModeOperationResource.class);

    private static final String ENTITY_NAME = "modeOperation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ModeOperationService modeOperationService;

    private final ModeOperationRepository modeOperationRepository;

    public ModeOperationResource(ModeOperationService modeOperationService, ModeOperationRepository modeOperationRepository) {
        this.modeOperationService = modeOperationService;
        this.modeOperationRepository = modeOperationRepository;
    }

    /**
     * {@code POST  /mode-operations} : Create a new modeOperation.
     *
     * @param modeOperationDTO the modeOperationDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new modeOperationDTO, or with status {@code 400 (Bad Request)} if the modeOperation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ModeOperationDTO> createModeOperation(@RequestBody ModeOperationDTO modeOperationDTO) throws URISyntaxException {
        log.debug("REST request to save ModeOperation : {}", modeOperationDTO);
        if (modeOperationDTO.getId() != null) {
            throw new BadRequestAlertException("A new modeOperation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ModeOperationDTO result = modeOperationService.save(modeOperationDTO);
        return ResponseEntity
            .created(new URI("/api/mode-operations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /mode-operations/:id} : Updates an existing modeOperation.
     *
     * @param id the id of the modeOperationDTO to save.
     * @param modeOperationDTO the modeOperationDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated modeOperationDTO,
     * or with status {@code 400 (Bad Request)} if the modeOperationDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the modeOperationDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ModeOperationDTO> updateModeOperation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ModeOperationDTO modeOperationDTO
    ) throws URISyntaxException {
        log.debug("REST request to update ModeOperation : {}, {}", id, modeOperationDTO);
        if (modeOperationDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, modeOperationDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!modeOperationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ModeOperationDTO result = modeOperationService.update(modeOperationDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, modeOperationDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /mode-operations/:id} : Partial updates given fields of an existing modeOperation, field will ignore if it is null
     *
     * @param id the id of the modeOperationDTO to save.
     * @param modeOperationDTO the modeOperationDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated modeOperationDTO,
     * or with status {@code 400 (Bad Request)} if the modeOperationDTO is not valid,
     * or with status {@code 404 (Not Found)} if the modeOperationDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the modeOperationDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ModeOperationDTO> partialUpdateModeOperation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ModeOperationDTO modeOperationDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update ModeOperation partially : {}, {}", id, modeOperationDTO);
        if (modeOperationDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, modeOperationDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!modeOperationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ModeOperationDTO> result = modeOperationService.partialUpdate(modeOperationDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, modeOperationDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /mode-operations} : get all the modeOperations.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of modeOperations in body.
     */
    @GetMapping("")
    public List<ModeOperationDTO> getAllModeOperations() {
        log.debug("REST request to get all ModeOperations");
        return modeOperationService.findAll();
    }

    /**
     * {@code GET  /mode-operations/:id} : get the "id" modeOperation.
     *
     * @param id the id of the modeOperationDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the modeOperationDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ModeOperationDTO> getModeOperation(@PathVariable Long id) {
        log.debug("REST request to get ModeOperation : {}", id);
        Optional<ModeOperationDTO> modeOperationDTO = modeOperationService.findOne(id);
        return ResponseUtil.wrapOrNotFound(modeOperationDTO);
    }

    /**
     * {@code DELETE  /mode-operations/:id} : delete the "id" modeOperation.
     *
     * @param id the id of the modeOperationDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteModeOperation(@PathVariable Long id) {
        log.debug("REST request to delete ModeOperation : {}", id);
        modeOperationService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
