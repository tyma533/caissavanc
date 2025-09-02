package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.repository.AgentEtatProfilRepository;
import com.mycompany.myapp.service.AgentEtatProfilService;
import com.mycompany.myapp.service.dto.AgentEtatProfilDTO;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.AgentEtatProfil}.
 */
@RestController
@RequestMapping("/api/agent-etat-profils")
public class AgentEtatProfilResource {

    private final Logger log = LoggerFactory.getLogger(AgentEtatProfilResource.class);

    private static final String ENTITY_NAME = "agentEtatProfil";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AgentEtatProfilService agentEtatProfilService;

    private final AgentEtatProfilRepository agentEtatProfilRepository;

    public AgentEtatProfilResource(AgentEtatProfilService agentEtatProfilService, AgentEtatProfilRepository agentEtatProfilRepository) {
        this.agentEtatProfilService = agentEtatProfilService;
        this.agentEtatProfilRepository = agentEtatProfilRepository;
    }

    /**
     * {@code POST  /agent-etat-profils} : Create a new agentEtatProfil.
     *
     * @param agentEtatProfilDTO the agentEtatProfilDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new agentEtatProfilDTO, or with status {@code 400 (Bad Request)} if the agentEtatProfil has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<AgentEtatProfilDTO> createAgentEtatProfil(@RequestBody AgentEtatProfilDTO agentEtatProfilDTO)
        throws URISyntaxException {
        log.debug("REST request to save AgentEtatProfil : {}", agentEtatProfilDTO);
        if (agentEtatProfilDTO.getId() != null) {
            throw new BadRequestAlertException("A new agentEtatProfil cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AgentEtatProfilDTO result = agentEtatProfilService.save(agentEtatProfilDTO);
        return ResponseEntity
            .created(new URI("/api/agent-etat-profils/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /agent-etat-profils/:id} : Updates an existing agentEtatProfil.
     *
     * @param id the id of the agentEtatProfilDTO to save.
     * @param agentEtatProfilDTO the agentEtatProfilDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated agentEtatProfilDTO,
     * or with status {@code 400 (Bad Request)} if the agentEtatProfilDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the agentEtatProfilDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<AgentEtatProfilDTO> updateAgentEtatProfil(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AgentEtatProfilDTO agentEtatProfilDTO
    ) throws URISyntaxException {
        log.debug("REST request to update AgentEtatProfil : {}, {}", id, agentEtatProfilDTO);
        if (agentEtatProfilDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, agentEtatProfilDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!agentEtatProfilRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AgentEtatProfilDTO result = agentEtatProfilService.update(agentEtatProfilDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, agentEtatProfilDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /agent-etat-profils/:id} : Partial updates given fields of an existing agentEtatProfil, field will ignore if it is null
     *
     * @param id the id of the agentEtatProfilDTO to save.
     * @param agentEtatProfilDTO the agentEtatProfilDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated agentEtatProfilDTO,
     * or with status {@code 400 (Bad Request)} if the agentEtatProfilDTO is not valid,
     * or with status {@code 404 (Not Found)} if the agentEtatProfilDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the agentEtatProfilDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AgentEtatProfilDTO> partialUpdateAgentEtatProfil(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AgentEtatProfilDTO agentEtatProfilDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update AgentEtatProfil partially : {}, {}", id, agentEtatProfilDTO);
        if (agentEtatProfilDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, agentEtatProfilDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!agentEtatProfilRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AgentEtatProfilDTO> result = agentEtatProfilService.partialUpdate(agentEtatProfilDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, agentEtatProfilDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /agent-etat-profils} : get all the agentEtatProfils.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of agentEtatProfils in body.
     */
    @GetMapping("")
    public List<AgentEtatProfilDTO> getAllAgentEtatProfils() {
        log.debug("REST request to get all AgentEtatProfils");
        return agentEtatProfilService.findAll();
    }

    /**
     * {@code GET  /agent-etat-profils/:id} : get the "id" agentEtatProfil.
     *
     * @param id the id of the agentEtatProfilDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the agentEtatProfilDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<AgentEtatProfilDTO> getAgentEtatProfil(@PathVariable Long id) {
        log.debug("REST request to get AgentEtatProfil : {}", id);
        Optional<AgentEtatProfilDTO> agentEtatProfilDTO = agentEtatProfilService.findOne(id);
        return ResponseUtil.wrapOrNotFound(agentEtatProfilDTO);
    }

    /**
     * {@code DELETE  /agent-etat-profils/:id} : delete the "id" agentEtatProfil.
     *
     * @param id the id of the agentEtatProfilDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAgentEtatProfil(@PathVariable Long id) {
        log.debug("REST request to delete AgentEtatProfil : {}", id);
        agentEtatProfilService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
