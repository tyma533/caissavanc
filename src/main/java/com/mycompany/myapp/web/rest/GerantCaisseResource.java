package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.repository.GerantCaisseRepository;
import com.mycompany.myapp.service.GerantCaisseService;
import com.mycompany.myapp.service.dto.GerantCaisseDTO;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.GerantCaisse}.
 */
@RestController
@RequestMapping("/api/gerant-caisses")
public class GerantCaisseResource {

    private final Logger log = LoggerFactory.getLogger(GerantCaisseResource.class);

    private static final String ENTITY_NAME = "gerantCaisse";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GerantCaisseService gerantCaisseService;

    private final GerantCaisseRepository gerantCaisseRepository;

    public GerantCaisseResource(GerantCaisseService gerantCaisseService, GerantCaisseRepository gerantCaisseRepository) {
        this.gerantCaisseService = gerantCaisseService;
        this.gerantCaisseRepository = gerantCaisseRepository;
    }

    /**
     * {@code POST  /gerant-caisses} : Create a new gerantCaisse.
     *
     * @param gerantCaisseDTO the gerantCaisseDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new gerantCaisseDTO, or with status {@code 400 (Bad Request)} if the gerantCaisse has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<GerantCaisseDTO> createGerantCaisse(@RequestBody GerantCaisseDTO gerantCaisseDTO) throws URISyntaxException {
        log.debug("REST request to save GerantCaisse : {}", gerantCaisseDTO);
        if (gerantCaisseDTO.getId() != null) {
            throw new BadRequestAlertException("A new gerantCaisse cannot already have an ID", ENTITY_NAME, "idexists");
        }
        GerantCaisseDTO result = gerantCaisseService.save(gerantCaisseDTO);
        return ResponseEntity
            .created(new URI("/api/gerant-caisses/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /gerant-caisses/:id} : Updates an existing gerantCaisse.
     *
     * @param id the id of the gerantCaisseDTO to save.
     * @param gerantCaisseDTO the gerantCaisseDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated gerantCaisseDTO,
     * or with status {@code 400 (Bad Request)} if the gerantCaisseDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the gerantCaisseDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<GerantCaisseDTO> updateGerantCaisse(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody GerantCaisseDTO gerantCaisseDTO
    ) throws URISyntaxException {
        log.debug("REST request to update GerantCaisse : {}, {}", id, gerantCaisseDTO);
        if (gerantCaisseDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, gerantCaisseDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!gerantCaisseRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        GerantCaisseDTO result = gerantCaisseService.update(gerantCaisseDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, gerantCaisseDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /gerant-caisses/:id} : Partial updates given fields of an existing gerantCaisse, field will ignore if it is null
     *
     * @param id the id of the gerantCaisseDTO to save.
     * @param gerantCaisseDTO the gerantCaisseDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated gerantCaisseDTO,
     * or with status {@code 400 (Bad Request)} if the gerantCaisseDTO is not valid,
     * or with status {@code 404 (Not Found)} if the gerantCaisseDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the gerantCaisseDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<GerantCaisseDTO> partialUpdateGerantCaisse(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody GerantCaisseDTO gerantCaisseDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update GerantCaisse partially : {}, {}", id, gerantCaisseDTO);
        if (gerantCaisseDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, gerantCaisseDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!gerantCaisseRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<GerantCaisseDTO> result = gerantCaisseService.partialUpdate(gerantCaisseDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, gerantCaisseDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /gerant-caisses} : get all the gerantCaisses.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of gerantCaisses in body.
     */
    @GetMapping("")
    public List<GerantCaisseDTO> getAllGerantCaisses() {
        log.debug("REST request to get all GerantCaisses");
        return gerantCaisseService.findAll();
    }

    /**
     * {@code GET  /gerant-caisses/:id} : get the "id" gerantCaisse.
     *
     * @param id the id of the gerantCaisseDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the gerantCaisseDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<GerantCaisseDTO> getGerantCaisse(@PathVariable Long id) {
        log.debug("REST request to get GerantCaisse : {}", id);
        Optional<GerantCaisseDTO> gerantCaisseDTO = gerantCaisseService.findOne(id);
        return ResponseUtil.wrapOrNotFound(gerantCaisseDTO);
    }

    /**
     * {@code DELETE  /gerant-caisses/:id} : delete the "id" gerantCaisse.
     *
     * @param id the id of the gerantCaisseDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGerantCaisse(@PathVariable Long id) {
        log.debug("REST request to delete GerantCaisse : {}", id);
        gerantCaisseService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
