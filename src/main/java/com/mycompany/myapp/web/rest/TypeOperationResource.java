package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.repository.TypeOperationRepository;
import com.mycompany.myapp.service.TypeOperationService;
import com.mycompany.myapp.service.dto.TypeOperationDTO;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.TypeOperation}.
 */
@RestController
@RequestMapping("/api/type-operations")
public class TypeOperationResource {

    private final Logger log = LoggerFactory.getLogger(TypeOperationResource.class);

    private static final String ENTITY_NAME = "typeOperation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TypeOperationService typeOperationService;

    private final TypeOperationRepository typeOperationRepository;

    public TypeOperationResource(TypeOperationService typeOperationService, TypeOperationRepository typeOperationRepository) {
        this.typeOperationService = typeOperationService;
        this.typeOperationRepository = typeOperationRepository;
    }

    /**
     * {@code POST  /type-operations} : Create a new typeOperation.
     *
     * @param typeOperationDTO the typeOperationDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new typeOperationDTO, or with status {@code 400 (Bad Request)} if the typeOperation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<TypeOperationDTO> createTypeOperation(@RequestBody TypeOperationDTO typeOperationDTO) throws URISyntaxException {
        log.debug("REST request to save TypeOperation : {}", typeOperationDTO);
        if (typeOperationDTO.getId() != null) {
            throw new BadRequestAlertException("A new typeOperation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TypeOperationDTO result = typeOperationService.save(typeOperationDTO);
        return ResponseEntity
            .created(new URI("/api/type-operations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /type-operations/:id} : Updates an existing typeOperation.
     *
     * @param id the id of the typeOperationDTO to save.
     * @param typeOperationDTO the typeOperationDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated typeOperationDTO,
     * or with status {@code 400 (Bad Request)} if the typeOperationDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the typeOperationDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<TypeOperationDTO> updateTypeOperation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody TypeOperationDTO typeOperationDTO
    ) throws URISyntaxException {
        log.debug("REST request to update TypeOperation : {}, {}", id, typeOperationDTO);
        if (typeOperationDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, typeOperationDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!typeOperationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        TypeOperationDTO result = typeOperationService.update(typeOperationDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, typeOperationDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /type-operations/:id} : Partial updates given fields of an existing typeOperation, field will ignore if it is null
     *
     * @param id the id of the typeOperationDTO to save.
     * @param typeOperationDTO the typeOperationDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated typeOperationDTO,
     * or with status {@code 400 (Bad Request)} if the typeOperationDTO is not valid,
     * or with status {@code 404 (Not Found)} if the typeOperationDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the typeOperationDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TypeOperationDTO> partialUpdateTypeOperation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody TypeOperationDTO typeOperationDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update TypeOperation partially : {}, {}", id, typeOperationDTO);
        if (typeOperationDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, typeOperationDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!typeOperationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TypeOperationDTO> result = typeOperationService.partialUpdate(typeOperationDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, typeOperationDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /type-operations} : get all the typeOperations.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of typeOperations in body.
     */
    @GetMapping("")
    public List<TypeOperationDTO> getAllTypeOperations() {
        log.debug("REST request to get all TypeOperations");
        return typeOperationService.findAll();
    }

    /**
     * {@code GET  /type-operations/:id} : get the "id" typeOperation.
     *
     * @param id the id of the typeOperationDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the typeOperationDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<TypeOperationDTO> getTypeOperation(@PathVariable Long id) {
        log.debug("REST request to get TypeOperation : {}", id);
        Optional<TypeOperationDTO> typeOperationDTO = typeOperationService.findOne(id);
        return ResponseUtil.wrapOrNotFound(typeOperationDTO);
    }

    /**
     * {@code DELETE  /type-operations/:id} : delete the "id" typeOperation.
     *
     * @param id the id of the typeOperationDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTypeOperation(@PathVariable Long id) {
        log.debug("REST request to delete TypeOperation : {}", id);
        typeOperationService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
