package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.EtatOperation;
import com.mycompany.myapp.repository.EtatOperationRepository;
import com.mycompany.myapp.service.dto.EtatOperationDTO;
import com.mycompany.myapp.service.mapper.EtatOperationMapper;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link EtatOperationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EtatOperationResourceIT {

    private static final String DEFAULT_LIBELLE = "AAAAAAAAAA";
    private static final String UPDATED_LIBELLE = "BBBBBBBBBB";

    private static final Instant DEFAULT_DATE_HEURE_MODIFICATION = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_HEURE_MODIFICATION = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_DATE_HEURE_CREATION = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_HEURE_CREATION = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Long DEFAULT_UTI_CREE = 1L;
    private static final Long UPDATED_UTI_CREE = 2L;

    private static final Long DEFAULT_UTI_MODIFIE = 1L;
    private static final Long UPDATED_UTI_MODIFIE = 2L;

    private static final String ENTITY_API_URL = "/api/etat-operations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EtatOperationRepository etatOperationRepository;

    @Autowired
    private EtatOperationMapper etatOperationMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEtatOperationMockMvc;

    private EtatOperation etatOperation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EtatOperation createEntity(EntityManager em) {
        EtatOperation etatOperation = new EtatOperation()
            .libelle(DEFAULT_LIBELLE)
            .dateHeureModification(DEFAULT_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(DEFAULT_DATE_HEURE_CREATION)
            .utiCree(DEFAULT_UTI_CREE)
            .utiModifie(DEFAULT_UTI_MODIFIE);
        return etatOperation;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EtatOperation createUpdatedEntity(EntityManager em) {
        EtatOperation etatOperation = new EtatOperation()
            .libelle(UPDATED_LIBELLE)
            .dateHeureModification(UPDATED_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(UPDATED_DATE_HEURE_CREATION)
            .utiCree(UPDATED_UTI_CREE)
            .utiModifie(UPDATED_UTI_MODIFIE);
        return etatOperation;
    }

    @BeforeEach
    public void initTest() {
        etatOperation = createEntity(em);
    }

    @Test
    @Transactional
    void createEtatOperation() throws Exception {
        int databaseSizeBeforeCreate = etatOperationRepository.findAll().size();
        // Create the EtatOperation
        EtatOperationDTO etatOperationDTO = etatOperationMapper.toDto(etatOperation);
        restEtatOperationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(etatOperationDTO))
            )
            .andExpect(status().isCreated());

        // Validate the EtatOperation in the database
        List<EtatOperation> etatOperationList = etatOperationRepository.findAll();
        assertThat(etatOperationList).hasSize(databaseSizeBeforeCreate + 1);
        EtatOperation testEtatOperation = etatOperationList.get(etatOperationList.size() - 1);
        assertThat(testEtatOperation.getLibelle()).isEqualTo(DEFAULT_LIBELLE);
        assertThat(testEtatOperation.getDateHeureModification()).isEqualTo(DEFAULT_DATE_HEURE_MODIFICATION);
        assertThat(testEtatOperation.getDateHeureCreation()).isEqualTo(DEFAULT_DATE_HEURE_CREATION);
        assertThat(testEtatOperation.getUtiCree()).isEqualTo(DEFAULT_UTI_CREE);
        assertThat(testEtatOperation.getUtiModifie()).isEqualTo(DEFAULT_UTI_MODIFIE);
    }

    @Test
    @Transactional
    void createEtatOperationWithExistingId() throws Exception {
        // Create the EtatOperation with an existing ID
        etatOperation.setId(1L);
        EtatOperationDTO etatOperationDTO = etatOperationMapper.toDto(etatOperation);

        int databaseSizeBeforeCreate = etatOperationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEtatOperationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(etatOperationDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the EtatOperation in the database
        List<EtatOperation> etatOperationList = etatOperationRepository.findAll();
        assertThat(etatOperationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllEtatOperations() throws Exception {
        // Initialize the database
        etatOperationRepository.saveAndFlush(etatOperation);

        // Get all the etatOperationList
        restEtatOperationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(etatOperation.getId().intValue())))
            .andExpect(jsonPath("$.[*].libelle").value(hasItem(DEFAULT_LIBELLE)))
            .andExpect(jsonPath("$.[*].dateHeureModification").value(hasItem(DEFAULT_DATE_HEURE_MODIFICATION.toString())))
            .andExpect(jsonPath("$.[*].dateHeureCreation").value(hasItem(DEFAULT_DATE_HEURE_CREATION.toString())))
            .andExpect(jsonPath("$.[*].utiCree").value(hasItem(DEFAULT_UTI_CREE.intValue())))
            .andExpect(jsonPath("$.[*].utiModifie").value(hasItem(DEFAULT_UTI_MODIFIE.intValue())));
    }

    @Test
    @Transactional
    void getEtatOperation() throws Exception {
        // Initialize the database
        etatOperationRepository.saveAndFlush(etatOperation);

        // Get the etatOperation
        restEtatOperationMockMvc
            .perform(get(ENTITY_API_URL_ID, etatOperation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(etatOperation.getId().intValue()))
            .andExpect(jsonPath("$.libelle").value(DEFAULT_LIBELLE))
            .andExpect(jsonPath("$.dateHeureModification").value(DEFAULT_DATE_HEURE_MODIFICATION.toString()))
            .andExpect(jsonPath("$.dateHeureCreation").value(DEFAULT_DATE_HEURE_CREATION.toString()))
            .andExpect(jsonPath("$.utiCree").value(DEFAULT_UTI_CREE.intValue()))
            .andExpect(jsonPath("$.utiModifie").value(DEFAULT_UTI_MODIFIE.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingEtatOperation() throws Exception {
        // Get the etatOperation
        restEtatOperationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingEtatOperation() throws Exception {
        // Initialize the database
        etatOperationRepository.saveAndFlush(etatOperation);

        int databaseSizeBeforeUpdate = etatOperationRepository.findAll().size();

        // Update the etatOperation
        EtatOperation updatedEtatOperation = etatOperationRepository.findById(etatOperation.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedEtatOperation are not directly saved in db
        em.detach(updatedEtatOperation);
        updatedEtatOperation
            .libelle(UPDATED_LIBELLE)
            .dateHeureModification(UPDATED_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(UPDATED_DATE_HEURE_CREATION)
            .utiCree(UPDATED_UTI_CREE)
            .utiModifie(UPDATED_UTI_MODIFIE);
        EtatOperationDTO etatOperationDTO = etatOperationMapper.toDto(updatedEtatOperation);

        restEtatOperationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, etatOperationDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(etatOperationDTO))
            )
            .andExpect(status().isOk());

        // Validate the EtatOperation in the database
        List<EtatOperation> etatOperationList = etatOperationRepository.findAll();
        assertThat(etatOperationList).hasSize(databaseSizeBeforeUpdate);
        EtatOperation testEtatOperation = etatOperationList.get(etatOperationList.size() - 1);
        assertThat(testEtatOperation.getLibelle()).isEqualTo(UPDATED_LIBELLE);
        assertThat(testEtatOperation.getDateHeureModification()).isEqualTo(UPDATED_DATE_HEURE_MODIFICATION);
        assertThat(testEtatOperation.getDateHeureCreation()).isEqualTo(UPDATED_DATE_HEURE_CREATION);
        assertThat(testEtatOperation.getUtiCree()).isEqualTo(UPDATED_UTI_CREE);
        assertThat(testEtatOperation.getUtiModifie()).isEqualTo(UPDATED_UTI_MODIFIE);
    }

    @Test
    @Transactional
    void putNonExistingEtatOperation() throws Exception {
        int databaseSizeBeforeUpdate = etatOperationRepository.findAll().size();
        etatOperation.setId(longCount.incrementAndGet());

        // Create the EtatOperation
        EtatOperationDTO etatOperationDTO = etatOperationMapper.toDto(etatOperation);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEtatOperationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, etatOperationDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(etatOperationDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the EtatOperation in the database
        List<EtatOperation> etatOperationList = etatOperationRepository.findAll();
        assertThat(etatOperationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEtatOperation() throws Exception {
        int databaseSizeBeforeUpdate = etatOperationRepository.findAll().size();
        etatOperation.setId(longCount.incrementAndGet());

        // Create the EtatOperation
        EtatOperationDTO etatOperationDTO = etatOperationMapper.toDto(etatOperation);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEtatOperationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(etatOperationDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the EtatOperation in the database
        List<EtatOperation> etatOperationList = etatOperationRepository.findAll();
        assertThat(etatOperationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEtatOperation() throws Exception {
        int databaseSizeBeforeUpdate = etatOperationRepository.findAll().size();
        etatOperation.setId(longCount.incrementAndGet());

        // Create the EtatOperation
        EtatOperationDTO etatOperationDTO = etatOperationMapper.toDto(etatOperation);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEtatOperationMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(etatOperationDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EtatOperation in the database
        List<EtatOperation> etatOperationList = etatOperationRepository.findAll();
        assertThat(etatOperationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEtatOperationWithPatch() throws Exception {
        // Initialize the database
        etatOperationRepository.saveAndFlush(etatOperation);

        int databaseSizeBeforeUpdate = etatOperationRepository.findAll().size();

        // Update the etatOperation using partial update
        EtatOperation partialUpdatedEtatOperation = new EtatOperation();
        partialUpdatedEtatOperation.setId(etatOperation.getId());

        partialUpdatedEtatOperation.libelle(UPDATED_LIBELLE).dateHeureCreation(UPDATED_DATE_HEURE_CREATION).utiModifie(UPDATED_UTI_MODIFIE);

        restEtatOperationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEtatOperation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEtatOperation))
            )
            .andExpect(status().isOk());

        // Validate the EtatOperation in the database
        List<EtatOperation> etatOperationList = etatOperationRepository.findAll();
        assertThat(etatOperationList).hasSize(databaseSizeBeforeUpdate);
        EtatOperation testEtatOperation = etatOperationList.get(etatOperationList.size() - 1);
        assertThat(testEtatOperation.getLibelle()).isEqualTo(UPDATED_LIBELLE);
        assertThat(testEtatOperation.getDateHeureModification()).isEqualTo(DEFAULT_DATE_HEURE_MODIFICATION);
        assertThat(testEtatOperation.getDateHeureCreation()).isEqualTo(UPDATED_DATE_HEURE_CREATION);
        assertThat(testEtatOperation.getUtiCree()).isEqualTo(DEFAULT_UTI_CREE);
        assertThat(testEtatOperation.getUtiModifie()).isEqualTo(UPDATED_UTI_MODIFIE);
    }

    @Test
    @Transactional
    void fullUpdateEtatOperationWithPatch() throws Exception {
        // Initialize the database
        etatOperationRepository.saveAndFlush(etatOperation);

        int databaseSizeBeforeUpdate = etatOperationRepository.findAll().size();

        // Update the etatOperation using partial update
        EtatOperation partialUpdatedEtatOperation = new EtatOperation();
        partialUpdatedEtatOperation.setId(etatOperation.getId());

        partialUpdatedEtatOperation
            .libelle(UPDATED_LIBELLE)
            .dateHeureModification(UPDATED_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(UPDATED_DATE_HEURE_CREATION)
            .utiCree(UPDATED_UTI_CREE)
            .utiModifie(UPDATED_UTI_MODIFIE);

        restEtatOperationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEtatOperation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEtatOperation))
            )
            .andExpect(status().isOk());

        // Validate the EtatOperation in the database
        List<EtatOperation> etatOperationList = etatOperationRepository.findAll();
        assertThat(etatOperationList).hasSize(databaseSizeBeforeUpdate);
        EtatOperation testEtatOperation = etatOperationList.get(etatOperationList.size() - 1);
        assertThat(testEtatOperation.getLibelle()).isEqualTo(UPDATED_LIBELLE);
        assertThat(testEtatOperation.getDateHeureModification()).isEqualTo(UPDATED_DATE_HEURE_MODIFICATION);
        assertThat(testEtatOperation.getDateHeureCreation()).isEqualTo(UPDATED_DATE_HEURE_CREATION);
        assertThat(testEtatOperation.getUtiCree()).isEqualTo(UPDATED_UTI_CREE);
        assertThat(testEtatOperation.getUtiModifie()).isEqualTo(UPDATED_UTI_MODIFIE);
    }

    @Test
    @Transactional
    void patchNonExistingEtatOperation() throws Exception {
        int databaseSizeBeforeUpdate = etatOperationRepository.findAll().size();
        etatOperation.setId(longCount.incrementAndGet());

        // Create the EtatOperation
        EtatOperationDTO etatOperationDTO = etatOperationMapper.toDto(etatOperation);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEtatOperationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, etatOperationDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(etatOperationDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the EtatOperation in the database
        List<EtatOperation> etatOperationList = etatOperationRepository.findAll();
        assertThat(etatOperationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEtatOperation() throws Exception {
        int databaseSizeBeforeUpdate = etatOperationRepository.findAll().size();
        etatOperation.setId(longCount.incrementAndGet());

        // Create the EtatOperation
        EtatOperationDTO etatOperationDTO = etatOperationMapper.toDto(etatOperation);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEtatOperationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(etatOperationDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the EtatOperation in the database
        List<EtatOperation> etatOperationList = etatOperationRepository.findAll();
        assertThat(etatOperationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEtatOperation() throws Exception {
        int databaseSizeBeforeUpdate = etatOperationRepository.findAll().size();
        etatOperation.setId(longCount.incrementAndGet());

        // Create the EtatOperation
        EtatOperationDTO etatOperationDTO = etatOperationMapper.toDto(etatOperation);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEtatOperationMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(etatOperationDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EtatOperation in the database
        List<EtatOperation> etatOperationList = etatOperationRepository.findAll();
        assertThat(etatOperationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEtatOperation() throws Exception {
        // Initialize the database
        etatOperationRepository.saveAndFlush(etatOperation);

        int databaseSizeBeforeDelete = etatOperationRepository.findAll().size();

        // Delete the etatOperation
        restEtatOperationMockMvc
            .perform(delete(ENTITY_API_URL_ID, etatOperation.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<EtatOperation> etatOperationList = etatOperationRepository.findAll();
        assertThat(etatOperationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
