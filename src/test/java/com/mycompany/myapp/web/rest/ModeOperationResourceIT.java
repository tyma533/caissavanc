package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.ModeOperation;
import com.mycompany.myapp.repository.ModeOperationRepository;
import com.mycompany.myapp.service.dto.ModeOperationDTO;
import com.mycompany.myapp.service.mapper.ModeOperationMapper;
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
 * Integration tests for the {@link ModeOperationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ModeOperationResourceIT {

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

    private static final String ENTITY_API_URL = "/api/mode-operations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ModeOperationRepository modeOperationRepository;

    @Autowired
    private ModeOperationMapper modeOperationMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restModeOperationMockMvc;

    private ModeOperation modeOperation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ModeOperation createEntity(EntityManager em) {
        ModeOperation modeOperation = new ModeOperation()
            .libelle(DEFAULT_LIBELLE)
            .dateHeureModification(DEFAULT_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(DEFAULT_DATE_HEURE_CREATION)
            .utiCree(DEFAULT_UTI_CREE)
            .utiModifie(DEFAULT_UTI_MODIFIE);
        return modeOperation;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ModeOperation createUpdatedEntity(EntityManager em) {
        ModeOperation modeOperation = new ModeOperation()
            .libelle(UPDATED_LIBELLE)
            .dateHeureModification(UPDATED_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(UPDATED_DATE_HEURE_CREATION)
            .utiCree(UPDATED_UTI_CREE)
            .utiModifie(UPDATED_UTI_MODIFIE);
        return modeOperation;
    }

    @BeforeEach
    public void initTest() {
        modeOperation = createEntity(em);
    }

    @Test
    @Transactional
    void createModeOperation() throws Exception {
        int databaseSizeBeforeCreate = modeOperationRepository.findAll().size();
        // Create the ModeOperation
        ModeOperationDTO modeOperationDTO = modeOperationMapper.toDto(modeOperation);
        restModeOperationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(modeOperationDTO))
            )
            .andExpect(status().isCreated());

        // Validate the ModeOperation in the database
        List<ModeOperation> modeOperationList = modeOperationRepository.findAll();
        assertThat(modeOperationList).hasSize(databaseSizeBeforeCreate + 1);
        ModeOperation testModeOperation = modeOperationList.get(modeOperationList.size() - 1);
        assertThat(testModeOperation.getLibelle()).isEqualTo(DEFAULT_LIBELLE);
        assertThat(testModeOperation.getDateHeureModification()).isEqualTo(DEFAULT_DATE_HEURE_MODIFICATION);
        assertThat(testModeOperation.getDateHeureCreation()).isEqualTo(DEFAULT_DATE_HEURE_CREATION);
        assertThat(testModeOperation.getUtiCree()).isEqualTo(DEFAULT_UTI_CREE);
        assertThat(testModeOperation.getUtiModifie()).isEqualTo(DEFAULT_UTI_MODIFIE);
    }

    @Test
    @Transactional
    void createModeOperationWithExistingId() throws Exception {
        // Create the ModeOperation with an existing ID
        modeOperation.setId(1L);
        ModeOperationDTO modeOperationDTO = modeOperationMapper.toDto(modeOperation);

        int databaseSizeBeforeCreate = modeOperationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restModeOperationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(modeOperationDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ModeOperation in the database
        List<ModeOperation> modeOperationList = modeOperationRepository.findAll();
        assertThat(modeOperationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllModeOperations() throws Exception {
        // Initialize the database
        modeOperationRepository.saveAndFlush(modeOperation);

        // Get all the modeOperationList
        restModeOperationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(modeOperation.getId().intValue())))
            .andExpect(jsonPath("$.[*].libelle").value(hasItem(DEFAULT_LIBELLE)))
            .andExpect(jsonPath("$.[*].dateHeureModification").value(hasItem(DEFAULT_DATE_HEURE_MODIFICATION.toString())))
            .andExpect(jsonPath("$.[*].dateHeureCreation").value(hasItem(DEFAULT_DATE_HEURE_CREATION.toString())))
            .andExpect(jsonPath("$.[*].utiCree").value(hasItem(DEFAULT_UTI_CREE.intValue())))
            .andExpect(jsonPath("$.[*].utiModifie").value(hasItem(DEFAULT_UTI_MODIFIE.intValue())));
    }

    @Test
    @Transactional
    void getModeOperation() throws Exception {
        // Initialize the database
        modeOperationRepository.saveAndFlush(modeOperation);

        // Get the modeOperation
        restModeOperationMockMvc
            .perform(get(ENTITY_API_URL_ID, modeOperation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(modeOperation.getId().intValue()))
            .andExpect(jsonPath("$.libelle").value(DEFAULT_LIBELLE))
            .andExpect(jsonPath("$.dateHeureModification").value(DEFAULT_DATE_HEURE_MODIFICATION.toString()))
            .andExpect(jsonPath("$.dateHeureCreation").value(DEFAULT_DATE_HEURE_CREATION.toString()))
            .andExpect(jsonPath("$.utiCree").value(DEFAULT_UTI_CREE.intValue()))
            .andExpect(jsonPath("$.utiModifie").value(DEFAULT_UTI_MODIFIE.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingModeOperation() throws Exception {
        // Get the modeOperation
        restModeOperationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingModeOperation() throws Exception {
        // Initialize the database
        modeOperationRepository.saveAndFlush(modeOperation);

        int databaseSizeBeforeUpdate = modeOperationRepository.findAll().size();

        // Update the modeOperation
        ModeOperation updatedModeOperation = modeOperationRepository.findById(modeOperation.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedModeOperation are not directly saved in db
        em.detach(updatedModeOperation);
        updatedModeOperation
            .libelle(UPDATED_LIBELLE)
            .dateHeureModification(UPDATED_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(UPDATED_DATE_HEURE_CREATION)
            .utiCree(UPDATED_UTI_CREE)
            .utiModifie(UPDATED_UTI_MODIFIE);
        ModeOperationDTO modeOperationDTO = modeOperationMapper.toDto(updatedModeOperation);

        restModeOperationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, modeOperationDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(modeOperationDTO))
            )
            .andExpect(status().isOk());

        // Validate the ModeOperation in the database
        List<ModeOperation> modeOperationList = modeOperationRepository.findAll();
        assertThat(modeOperationList).hasSize(databaseSizeBeforeUpdate);
        ModeOperation testModeOperation = modeOperationList.get(modeOperationList.size() - 1);
        assertThat(testModeOperation.getLibelle()).isEqualTo(UPDATED_LIBELLE);
        assertThat(testModeOperation.getDateHeureModification()).isEqualTo(UPDATED_DATE_HEURE_MODIFICATION);
        assertThat(testModeOperation.getDateHeureCreation()).isEqualTo(UPDATED_DATE_HEURE_CREATION);
        assertThat(testModeOperation.getUtiCree()).isEqualTo(UPDATED_UTI_CREE);
        assertThat(testModeOperation.getUtiModifie()).isEqualTo(UPDATED_UTI_MODIFIE);
    }

    @Test
    @Transactional
    void putNonExistingModeOperation() throws Exception {
        int databaseSizeBeforeUpdate = modeOperationRepository.findAll().size();
        modeOperation.setId(longCount.incrementAndGet());

        // Create the ModeOperation
        ModeOperationDTO modeOperationDTO = modeOperationMapper.toDto(modeOperation);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restModeOperationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, modeOperationDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(modeOperationDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ModeOperation in the database
        List<ModeOperation> modeOperationList = modeOperationRepository.findAll();
        assertThat(modeOperationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchModeOperation() throws Exception {
        int databaseSizeBeforeUpdate = modeOperationRepository.findAll().size();
        modeOperation.setId(longCount.incrementAndGet());

        // Create the ModeOperation
        ModeOperationDTO modeOperationDTO = modeOperationMapper.toDto(modeOperation);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restModeOperationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(modeOperationDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ModeOperation in the database
        List<ModeOperation> modeOperationList = modeOperationRepository.findAll();
        assertThat(modeOperationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamModeOperation() throws Exception {
        int databaseSizeBeforeUpdate = modeOperationRepository.findAll().size();
        modeOperation.setId(longCount.incrementAndGet());

        // Create the ModeOperation
        ModeOperationDTO modeOperationDTO = modeOperationMapper.toDto(modeOperation);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restModeOperationMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(modeOperationDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ModeOperation in the database
        List<ModeOperation> modeOperationList = modeOperationRepository.findAll();
        assertThat(modeOperationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateModeOperationWithPatch() throws Exception {
        // Initialize the database
        modeOperationRepository.saveAndFlush(modeOperation);

        int databaseSizeBeforeUpdate = modeOperationRepository.findAll().size();

        // Update the modeOperation using partial update
        ModeOperation partialUpdatedModeOperation = new ModeOperation();
        partialUpdatedModeOperation.setId(modeOperation.getId());

        partialUpdatedModeOperation
            .libelle(UPDATED_LIBELLE)
            .dateHeureModification(UPDATED_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(UPDATED_DATE_HEURE_CREATION)
            .utiCree(UPDATED_UTI_CREE)
            .utiModifie(UPDATED_UTI_MODIFIE);

        restModeOperationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedModeOperation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedModeOperation))
            )
            .andExpect(status().isOk());

        // Validate the ModeOperation in the database
        List<ModeOperation> modeOperationList = modeOperationRepository.findAll();
        assertThat(modeOperationList).hasSize(databaseSizeBeforeUpdate);
        ModeOperation testModeOperation = modeOperationList.get(modeOperationList.size() - 1);
        assertThat(testModeOperation.getLibelle()).isEqualTo(UPDATED_LIBELLE);
        assertThat(testModeOperation.getDateHeureModification()).isEqualTo(UPDATED_DATE_HEURE_MODIFICATION);
        assertThat(testModeOperation.getDateHeureCreation()).isEqualTo(UPDATED_DATE_HEURE_CREATION);
        assertThat(testModeOperation.getUtiCree()).isEqualTo(UPDATED_UTI_CREE);
        assertThat(testModeOperation.getUtiModifie()).isEqualTo(UPDATED_UTI_MODIFIE);
    }

    @Test
    @Transactional
    void fullUpdateModeOperationWithPatch() throws Exception {
        // Initialize the database
        modeOperationRepository.saveAndFlush(modeOperation);

        int databaseSizeBeforeUpdate = modeOperationRepository.findAll().size();

        // Update the modeOperation using partial update
        ModeOperation partialUpdatedModeOperation = new ModeOperation();
        partialUpdatedModeOperation.setId(modeOperation.getId());

        partialUpdatedModeOperation
            .libelle(UPDATED_LIBELLE)
            .dateHeureModification(UPDATED_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(UPDATED_DATE_HEURE_CREATION)
            .utiCree(UPDATED_UTI_CREE)
            .utiModifie(UPDATED_UTI_MODIFIE);

        restModeOperationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedModeOperation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedModeOperation))
            )
            .andExpect(status().isOk());

        // Validate the ModeOperation in the database
        List<ModeOperation> modeOperationList = modeOperationRepository.findAll();
        assertThat(modeOperationList).hasSize(databaseSizeBeforeUpdate);
        ModeOperation testModeOperation = modeOperationList.get(modeOperationList.size() - 1);
        assertThat(testModeOperation.getLibelle()).isEqualTo(UPDATED_LIBELLE);
        assertThat(testModeOperation.getDateHeureModification()).isEqualTo(UPDATED_DATE_HEURE_MODIFICATION);
        assertThat(testModeOperation.getDateHeureCreation()).isEqualTo(UPDATED_DATE_HEURE_CREATION);
        assertThat(testModeOperation.getUtiCree()).isEqualTo(UPDATED_UTI_CREE);
        assertThat(testModeOperation.getUtiModifie()).isEqualTo(UPDATED_UTI_MODIFIE);
    }

    @Test
    @Transactional
    void patchNonExistingModeOperation() throws Exception {
        int databaseSizeBeforeUpdate = modeOperationRepository.findAll().size();
        modeOperation.setId(longCount.incrementAndGet());

        // Create the ModeOperation
        ModeOperationDTO modeOperationDTO = modeOperationMapper.toDto(modeOperation);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restModeOperationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, modeOperationDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(modeOperationDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ModeOperation in the database
        List<ModeOperation> modeOperationList = modeOperationRepository.findAll();
        assertThat(modeOperationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchModeOperation() throws Exception {
        int databaseSizeBeforeUpdate = modeOperationRepository.findAll().size();
        modeOperation.setId(longCount.incrementAndGet());

        // Create the ModeOperation
        ModeOperationDTO modeOperationDTO = modeOperationMapper.toDto(modeOperation);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restModeOperationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(modeOperationDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ModeOperation in the database
        List<ModeOperation> modeOperationList = modeOperationRepository.findAll();
        assertThat(modeOperationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamModeOperation() throws Exception {
        int databaseSizeBeforeUpdate = modeOperationRepository.findAll().size();
        modeOperation.setId(longCount.incrementAndGet());

        // Create the ModeOperation
        ModeOperationDTO modeOperationDTO = modeOperationMapper.toDto(modeOperation);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restModeOperationMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(modeOperationDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ModeOperation in the database
        List<ModeOperation> modeOperationList = modeOperationRepository.findAll();
        assertThat(modeOperationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteModeOperation() throws Exception {
        // Initialize the database
        modeOperationRepository.saveAndFlush(modeOperation);

        int databaseSizeBeforeDelete = modeOperationRepository.findAll().size();

        // Delete the modeOperation
        restModeOperationMockMvc
            .perform(delete(ENTITY_API_URL_ID, modeOperation.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ModeOperation> modeOperationList = modeOperationRepository.findAll();
        assertThat(modeOperationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
