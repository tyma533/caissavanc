package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.repository.CaisseRepository;
import com.mycompany.myapp.service.CaisseRubriqueService;
import com.mycompany.myapp.service.CaisseService;
import com.mycompany.myapp.service.DemandeService;
import com.mycompany.myapp.service.OperationService;
import com.mycompany.myapp.service.dto.CaisseDTO;
import com.mycompany.myapp.service.dto.CaisseRubriqueDTO;
import com.mycompany.myapp.service.dto.DemandeDTO;
import com.mycompany.myapp.service.dto.OperationDTO;
import com.mycompany.myapp.service.dto.RubriqueDTO;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Caisse}.
 */
@RestController
@RequestMapping("/api/caisses")
public class CaisseResource {

    private final Logger log = LoggerFactory.getLogger(CaisseResource.class);

    private static final String ENTITY_NAME = "caisse";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CaisseService caisseService;

    private final CaisseRepository caisseRepository;

    private final CaisseRubriqueService caisseRubriqueService;

    private final OperationService operationService;

    private final DemandeService DemandeService;

    public CaisseResource(
        CaisseService caisseService,
        CaisseRepository caisseRepository,
        CaisseRubriqueService caisseRubriqueService,
        OperationService operationService,
        DemandeService DemandeService
    ) {
        this.caisseService = caisseService;
        this.caisseRepository = caisseRepository;
        this.caisseRubriqueService = caisseRubriqueService;
        this.operationService = operationService;
        this.DemandeService = DemandeService;
    }

    /**
     * {@code POST  /caisses} : Create a new caisse.
     *
     * @param caisseDTO the caisseDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new caisseDTO, or with status {@code 400 (Bad Request)} if the caisse has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<CaisseDTO> createCaisse(@Valid @RequestBody CaisseDTO caisseDTO) throws URISyntaxException {
        log.debug("REST request to save Caisse : {}", caisseDTO);
        if (caisseDTO.getId() != null) {
            throw new BadRequestAlertException("A new caisse cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CaisseDTO result = caisseService.save(caisseDTO);
        return ResponseEntity
            .created(new URI("/api/caisses/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    //    @PostMapping("/{caisseId}/affecter/{rubriqueId}")
    // public ResponseEntity<Void> affecterRubrique(@PathVariable Long caisseId, @PathVariable Long rubriqueId) {
    //     caisseService.affecterRubrique(caisseId, rubriqueId);
    //     return ResponseEntity.ok().build();
    // }

    @PostMapping("/{caisseId}/desaffecter/{rubriqueId}")
    public ResponseEntity<Void> desaffecterRubrique(@PathVariable Long caisseId, @PathVariable Long rubriqueId) {
        caisseService.desaffecterRubrique(caisseId, rubriqueId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{caisseId}/affecter/{rubriqueId}")
    public ResponseEntity<CaisseRubriqueDTO> affecterRubriqueALaCaisse(
        @PathVariable("caisseId") Long caisseId,
        @PathVariable("rubriqueId") Long rubriqueId
    ) {
        CaisseRubriqueDTO result = caisseRubriqueService.affecterRubriqueALaCaisse(caisseId, rubriqueId);
        return ResponseEntity.ok(result);
    }

    /**
     * {@code PUT  /caisses/:id} : Updates an existing caisse.
     *
     * @param id the id of the caisseDTO to save.
     * @param caisseDTO the caisseDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated caisseDTO,
     * or with status {@code 400 (Bad Request)} if the caisseDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the caisseDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<CaisseDTO> updateCaisse(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody CaisseDTO caisseDTO
    ) throws URISyntaxException {
        log.debug("REST request to update Caisse : {}, {}", id, caisseDTO);
        if (caisseDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, caisseDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!caisseRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CaisseDTO result = caisseService.update(caisseDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, caisseDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /caisses/:id} : Partial updates given fields of an existing caisse, field will ignore if it is null
     *
     * @param id the id of the caisseDTO to save.
     * @param caisseDTO the caisseDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated caisseDTO,
     * or with status {@code 400 (Bad Request)} if the caisseDTO is not valid,
     * or with status {@code 404 (Not Found)} if the caisseDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the caisseDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CaisseDTO> partialUpdateCaisse(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody CaisseDTO caisseDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Caisse partially : {}, {}", id, caisseDTO);
        if (caisseDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, caisseDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!caisseRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CaisseDTO> result = caisseService.partialUpdate(caisseDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, caisseDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /caisses} : get all the caisses.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of caisses in body.
     */
    @GetMapping("")
    public List<CaisseDTO> getAllCaisses() {
        log.debug("REST request to get all Caisses");
        return caisseService.findAll();
    }

    /**
     * {@code GET  /caisses/:id} : get the "id" caisse.
     *
     * @param id the id of the caisseDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the caisseDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<CaisseDTO> getCaisse(@PathVariable Long id) {
        log.debug("REST request to get Caisse : {}", id);
        Optional<CaisseDTO> caisseDTO = caisseService.findOne(id);
        return ResponseUtil.wrapOrNotFound(caisseDTO);
    }

    @GetMapping("/{caisseId}/rubriques/affectees")
    public List<RubriqueDTO> getRubriquesAffectees(@PathVariable Long caisseId) {
        log.debug("REST request to get rubriques affectées for Caisse {}", caisseId);
        return caisseService.getRubriquesAffectees(caisseId);
    }

    @GetMapping("/{caisseId}/rubriques/non-affectees")
    public List<RubriqueDTO> getRubriquesNonAffectees(@PathVariable Long caisseId) {
        log.debug("REST request to get rubriques non affectées for Caisse {}", caisseId);
        return caisseService.getRubriquesNonAffectees(caisseId);
    }

    @GetMapping("/by-etablissement/{etablissementId}")
    public ResponseEntity<List<CaisseDTO>> getByEtablissement(@PathVariable Long etablissementId) {
        List<CaisseDTO> caisses = caisseService.findByEtablissementId(etablissementId);
        return ResponseEntity.ok().body(caisses);
    }

    @GetMapping("/etablissement/{etablissementId}/ouvertes")
    public List<CaisseDTO> getCaissesOuvertesByEtablissement(@PathVariable Long etablissementId) {
        return caisseService.findOuvertesByEtablissement(etablissementId);
    }

    @GetMapping("/caisses-fermees/etablissement/{etablissementId}")
    public List<CaisseDTO> getCaissesFermeesByEtablissement(@PathVariable Long etablissementId) {
        return caisseService.findFermeesByEtablissement(etablissementId);
    }

    @GetMapping("/{id}/operations")
    public List<OperationDTO> getOperationsByCaisse(@PathVariable Long id) {
        return operationService.findByCaisse(id);
    }

    @GetMapping("/{id}/depenses")
    public List<OperationDTO> getDepensesByCaisse(@PathVariable Long id) {
        return operationService.findDepensesByCaisse(id);
    }

    // @GetMapping("/{id}/demandes")
    // public List<DemandeDTO> getDemandesByCaisse(@PathVariable Long id) {
    //     return DemandeService.findByCaisse(id);
    // }

    @GetMapping("/{id}/demandes/alimentations")
    public List<DemandeDTO> getDemandesAlimentations(@PathVariable Long id) {
        return DemandeService.findByCaisseAndTypeDemande(id, "ALIMENTATION_CAISSE");
    }

    /**
     * {@code DELETE  /caisses/:id} : delete the "id" caisse.
     *
     * @param id the id of the caisseDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCaisse(@PathVariable Long id) {
        log.debug("REST request to delete Caisse : {}", id);
        caisseService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @GetMapping("/caisses")
    public ResponseEntity<List<CaisseDTO>> getAllCaisses(
        @RequestParam(required = false) String libelle,
        @RequestParam(required = false) String etablissement
    ) {
        List<CaisseDTO> list = caisseService.findAllFiltered(libelle, etablissement);
        return ResponseEntity.ok().body(list);
    }
}
