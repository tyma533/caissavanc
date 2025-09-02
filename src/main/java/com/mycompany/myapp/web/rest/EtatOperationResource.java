package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.repository.EtatOperationRepository;
import com.mycompany.myapp.service.EtatOperationService;
import com.mycompany.myapp.service.dto.EtatOperationDTO;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.EtatOperation}.
 */
@RestController
@RequestMapping("/api/etat-operations")
public class EtatOperationResource {

    private final Logger log = LoggerFactory.getLogger(EtatOperationResource.class);

    private static final String ENTITY_NAME = "etatOperation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EtatOperationService etatOperationService;

    private final EtatOperationRepository etatOperationRepository;

    public EtatOperationResource(EtatOperationService etatOperationService, EtatOperationRepository etatOperationRepository) {
        this.etatOperationService = etatOperationService;
        this.etatOperationRepository = etatOperationRepository;
    }

    /**
     * {@code POST  /etat-operations} : Create a new etatOperation.
     *
     * @param etatOperationDTO the etatOperationDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new etatOperationDTO, or with status {@code 400 (Bad Request)} if the etatOperation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<EtatOperationDTO> createEtatOperation(@RequestBody EtatOperationDTO etatOperationDTO) throws URISyntaxException {
        log.debug("REST request to save EtatOperation : {}", etatOperationDTO);
        if (etatOperationDTO.getId() != null) {
            throw new BadRequestAlertException("A new etatOperation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EtatOperationDTO result = etatOperationService.save(etatOperationDTO);
        return ResponseEntity
            .created(new URI("/api/etat-operations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /etat-operations/:id} : Updates an existing etatOperation.
     *
     * @param id the id of the etatOperationDTO to save.
     * @param etatOperationDTO the etatOperationDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated etatOperationDTO,
     * or with status {@code 400 (Bad Request)} if the etatOperationDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the etatOperationDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<EtatOperationDTO> updateEtatOperation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EtatOperationDTO etatOperationDTO
    ) throws URISyntaxException {
        log.debug("REST request to update EtatOperation : {}, {}", id, etatOperationDTO);
        if (etatOperationDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, etatOperationDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!etatOperationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        EtatOperationDTO result = etatOperationService.update(etatOperationDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, etatOperationDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /etat-operations/:id} : Partial updates given fields of an existing etatOperation, field will ignore if it is null
     *
     * @param id the id of the etatOperationDTO to save.
     * @param etatOperationDTO the etatOperationDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated etatOperationDTO,
     * or with status {@code 400 (Bad Request)} if the etatOperationDTO is not valid,
     * or with status {@code 404 (Not Found)} if the etatOperationDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the etatOperationDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<EtatOperationDTO> partialUpdateEtatOperation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EtatOperationDTO etatOperationDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update EtatOperation partially : {}, {}", id, etatOperationDTO);
        if (etatOperationDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, etatOperationDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!etatOperationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<EtatOperationDTO> result = etatOperationService.partialUpdate(etatOperationDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, etatOperationDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /etat-operations} : get all the etatOperations.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of etatOperations in body.
     */
    @GetMapping("")
    public List<EtatOperationDTO> getAllEtatOperations() {
        log.debug("REST request to get all EtatOperations");
        return etatOperationService.findAll();
    }

    /**
     * {@code GET  /etat-operations/:id} : get the "id" etatOperation.
     *
     * @param id the id of the etatOperationDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the etatOperationDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<EtatOperationDTO> getEtatOperation(@PathVariable Long id) {
        log.debug("REST request to get EtatOperation : {}", id);
        Optional<EtatOperationDTO> etatOperationDTO = etatOperationService.findOne(id);
        return ResponseUtil.wrapOrNotFound(etatOperationDTO);
    }

    /**
     * {@code DELETE  /etat-operations/:id} : delete the "id" etatOperation.
     *
     * @param id the id of the etatOperationDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEtatOperation(@PathVariable Long id) {
        log.debug("REST request to delete EtatOperation : {}", id);
        etatOperationService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
