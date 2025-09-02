package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.repository.ControleRepository;
import com.mycompany.myapp.service.ControleService;
import com.mycompany.myapp.service.dto.ControleDTO;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Controle}.
 */
@RestController
@RequestMapping("/api/controles")
public class ControleResource {

    private final Logger log = LoggerFactory.getLogger(ControleResource.class);

    private static final String ENTITY_NAME = "controle";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ControleService controleService;

    private final ControleRepository controleRepository;

    public ControleResource(ControleService controleService, ControleRepository controleRepository) {
        this.controleService = controleService;
        this.controleRepository = controleRepository;
    }

    /**
     * {@code POST  /controles} : Create a new controle.
     *
     * @param controleDTO the controleDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new controleDTO, or with status {@code 400 (Bad Request)} if the controle has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ControleDTO> createControle(@RequestBody ControleDTO controleDTO) throws URISyntaxException {
        log.debug("REST request to save Controle : {}", controleDTO);
        if (controleDTO.getId() != null) {
            throw new BadRequestAlertException("A new controle cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ControleDTO result = controleService.save(controleDTO);
        return ResponseEntity
            .created(new URI("/api/controles/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /controles/:id} : Updates an existing controle.
     *
     * @param id the id of the controleDTO to save.
     * @param controleDTO the controleDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated controleDTO,
     * or with status {@code 400 (Bad Request)} if the controleDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the controleDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ControleDTO> updateControle(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ControleDTO controleDTO
    ) throws URISyntaxException {
        log.debug("REST request to update Controle : {}, {}", id, controleDTO);
        if (controleDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, controleDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!controleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ControleDTO result = controleService.update(controleDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, controleDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /controles/:id} : Partial updates given fields of an existing controle, field will ignore if it is null
     *
     * @param id the id of the controleDTO to save.
     * @param controleDTO the controleDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated controleDTO,
     * or with status {@code 400 (Bad Request)} if the controleDTO is not valid,
     * or with status {@code 404 (Not Found)} if the controleDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the controleDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ControleDTO> partialUpdateControle(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ControleDTO controleDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Controle partially : {}, {}", id, controleDTO);
        if (controleDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, controleDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!controleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ControleDTO> result = controleService.partialUpdate(controleDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, controleDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /controles} : get all the controles.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of controles in body.
     */
    @GetMapping("")
    public List<ControleDTO> getAllControles() {
        log.debug("REST request to get all Controles");
        return controleService.findAll();
    }

    /**
     * {@code GET  /controles/:id} : get the "id" controle.
     *
     * @param id the id of the controleDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the controleDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ControleDTO> getControle(@PathVariable Long id) {
        log.debug("REST request to get Controle : {}", id);
        Optional<ControleDTO> controleDTO = controleService.findOne(id);
        return ResponseUtil.wrapOrNotFound(controleDTO);
    }

    /**
     * {@code DELETE  /controles/:id} : delete the "id" controle.
     *
     * @param id the id of the controleDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteControle(@PathVariable Long id) {
        log.debug("REST request to delete Controle : {}", id);
        controleService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
