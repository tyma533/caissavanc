package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.repository.CaisseRubriqueRepository;
import com.mycompany.myapp.service.CaisseRubriqueService;
import com.mycompany.myapp.service.dto.CaisseRubriqueDTO;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.CaisseRubrique}.
 */
@RestController
@RequestMapping("/api/caisse-rubriques")
public class CaisseRubriqueResource {

    private final Logger log = LoggerFactory.getLogger(CaisseRubriqueResource.class);

    private static final String ENTITY_NAME = "caisseRubrique";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CaisseRubriqueService caisseRubriqueService;

    private final CaisseRubriqueRepository caisseRubriqueRepository;

    public CaisseRubriqueResource(CaisseRubriqueService caisseRubriqueService, CaisseRubriqueRepository caisseRubriqueRepository) {
        this.caisseRubriqueService = caisseRubriqueService;
        this.caisseRubriqueRepository = caisseRubriqueRepository;
    }

    /**
     * {@code POST  /caisse-rubriques} : Create a new caisseRubrique.
     *
     * @param caisseRubriqueDTO the caisseRubriqueDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new caisseRubriqueDTO, or with status {@code 400 (Bad Request)} if the caisseRubrique has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<CaisseRubriqueDTO> createCaisseRubrique(@RequestBody CaisseRubriqueDTO caisseRubriqueDTO)
        throws URISyntaxException {
        log.debug("REST request to save CaisseRubrique : {}", caisseRubriqueDTO);
        if (caisseRubriqueDTO.getId() != null) {
            throw new BadRequestAlertException("A new caisseRubrique cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CaisseRubriqueDTO result = caisseRubriqueService.save(caisseRubriqueDTO);
        return ResponseEntity
            .created(new URI("/api/caisse-rubriques/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /caisse-rubriques/:id} : Updates an existing caisseRubrique.
     *
     * @param id the id of the caisseRubriqueDTO to save.
     * @param caisseRubriqueDTO the caisseRubriqueDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated caisseRubriqueDTO,
     * or with status {@code 400 (Bad Request)} if the caisseRubriqueDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the caisseRubriqueDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<CaisseRubriqueDTO> updateCaisseRubrique(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CaisseRubriqueDTO caisseRubriqueDTO
    ) throws URISyntaxException {
        log.debug("REST request to update CaisseRubrique : {}, {}", id, caisseRubriqueDTO);
        if (caisseRubriqueDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, caisseRubriqueDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!caisseRubriqueRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CaisseRubriqueDTO result = caisseRubriqueService.update(caisseRubriqueDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, caisseRubriqueDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /caisse-rubriques/:id} : Partial updates given fields of an existing caisseRubrique, field will ignore if it is null
     *
     * @param id the id of the caisseRubriqueDTO to save.
     * @param caisseRubriqueDTO the caisseRubriqueDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated caisseRubriqueDTO,
     * or with status {@code 400 (Bad Request)} if the caisseRubriqueDTO is not valid,
     * or with status {@code 404 (Not Found)} if the caisseRubriqueDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the caisseRubriqueDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CaisseRubriqueDTO> partialUpdateCaisseRubrique(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CaisseRubriqueDTO caisseRubriqueDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update CaisseRubrique partially : {}, {}", id, caisseRubriqueDTO);
        if (caisseRubriqueDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, caisseRubriqueDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!caisseRubriqueRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CaisseRubriqueDTO> result = caisseRubriqueService.partialUpdate(caisseRubriqueDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, caisseRubriqueDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /caisse-rubriques} : get all the caisseRubriques.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of caisseRubriques in body.
     */
    @GetMapping("")
    public List<CaisseRubriqueDTO> getAllCaisseRubriques() {
        log.debug("REST request to get all CaisseRubriques");
        return caisseRubriqueService.findAll();
    }

    /**
     * {@code GET  /caisse-rubriques/:id} : get the "id" caisseRubrique.
     *
     * @param id the id of the caisseRubriqueDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the caisseRubriqueDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<CaisseRubriqueDTO> getCaisseRubrique(@PathVariable Long id) {
        log.debug("REST request to get CaisseRubrique : {}", id);
        Optional<CaisseRubriqueDTO> caisseRubriqueDTO = caisseRubriqueService.findOne(id);
        return ResponseUtil.wrapOrNotFound(caisseRubriqueDTO);
    }

    /**
     * {@code DELETE  /caisse-rubriques/:id} : delete the "id" caisseRubrique.
     *
     * @param id the id of the caisseRubriqueDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCaisseRubrique(@PathVariable Long id) {
        log.debug("REST request to delete CaisseRubrique : {}", id);
        caisseRubriqueService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
