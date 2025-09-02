package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.repository.GerantRepository;
import com.mycompany.myapp.service.GerantService;
import com.mycompany.myapp.service.dto.GerantDTO;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Gerant}.
 */
@RestController
@RequestMapping("/api/gerants")
public class GerantResource {

    private final Logger log = LoggerFactory.getLogger(GerantResource.class);

    private static final String ENTITY_NAME = "gerant";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GerantService gerantService;

    private final GerantRepository gerantRepository;

    public GerantResource(GerantService gerantService, GerantRepository gerantRepository) {
        this.gerantService = gerantService;
        this.gerantRepository = gerantRepository;
    }

    /**
     * {@code POST  /gerants} : Create a new gerant.
     *
     * @param gerantDTO the gerantDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new gerantDTO, or with status {@code 400 (Bad Request)} if the gerant has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<GerantDTO> createGerant(@RequestBody GerantDTO gerantDTO) throws URISyntaxException {
        log.debug("REST request to save Gerant : {}", gerantDTO);
        if (gerantDTO.getId() != null) {
            throw new BadRequestAlertException("A new gerant cannot already have an ID", ENTITY_NAME, "idexists");
        }
        GerantDTO result = gerantService.save(gerantDTO);
        return ResponseEntity
            .created(new URI("/api/gerants/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /gerants/:id} : Updates an existing gerant.
     *
     * @param id the id of the gerantDTO to save.
     * @param gerantDTO the gerantDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated gerantDTO,
     * or with status {@code 400 (Bad Request)} if the gerantDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the gerantDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<GerantDTO> updateGerant(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody GerantDTO gerantDTO
    ) throws URISyntaxException {
        log.debug("REST request to update Gerant : {}, {}", id, gerantDTO);
        if (gerantDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, gerantDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!gerantRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        GerantDTO result = gerantService.update(gerantDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, gerantDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /gerants/:id} : Partial updates given fields of an existing gerant, field will ignore if it is null
     *
     * @param id the id of the gerantDTO to save.
     * @param gerantDTO the gerantDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated gerantDTO,
     * or with status {@code 400 (Bad Request)} if the gerantDTO is not valid,
     * or with status {@code 404 (Not Found)} if the gerantDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the gerantDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<GerantDTO> partialUpdateGerant(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody GerantDTO gerantDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Gerant partially : {}, {}", id, gerantDTO);
        if (gerantDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, gerantDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!gerantRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<GerantDTO> result = gerantService.partialUpdate(gerantDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, gerantDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /gerants} : get all the gerants.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of gerants in body.
     */
    @GetMapping("")
    public List<GerantDTO> getAllGerants() {
        log.debug("REST request to get all Gerants");
        return gerantService.findAll();
    }

    /**
     * {@code GET  /gerants/:id} : get the "id" gerant.
     *
     * @param id the id of the gerantDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the gerantDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<GerantDTO> getGerant(@PathVariable Long id) {
        log.debug("REST request to get Gerant : {}", id);
        Optional<GerantDTO> gerantDTO = gerantService.findOne(id);
        return ResponseUtil.wrapOrNotFound(gerantDTO);
    }

    /**
     * {@code DELETE  /gerants/:id} : delete the "id" gerant.
     *
     * @param id the id of the gerantDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGerant(@PathVariable Long id) {
        log.debug("REST request to delete Gerant : {}", id);
        gerantService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
