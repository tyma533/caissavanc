package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.TypeOperation;
import com.mycompany.myapp.repository.TypeOperationRepository;
import com.mycompany.myapp.service.dto.TypeOperationDTO;
import com.mycompany.myapp.service.mapper.TypeOperationMapper;
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
 * Integration tests for the {@link TypeOperationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TypeOperationResourceIT {

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

    private static final String ENTITY_API_URL = "/api/type-operations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TypeOperationRepository typeOperationRepository;

    @Autowired
    private TypeOperationMapper typeOperationMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTypeOperationMockMvc;

    private TypeOperation typeOperation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TypeOperation createEntity(EntityManager em) {
        TypeOperation typeOperation = new TypeOperation()
            .libelle(DEFAULT_LIBELLE)
            .dateHeureModification(DEFAULT_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(DEFAULT_DATE_HEURE_CREATION)
            .utiCree(DEFAULT_UTI_CREE)
            .utiModifie(DEFAULT_UTI_MODIFIE);
        return typeOperation;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TypeOperation createUpdatedEntity(EntityManager em) {
        TypeOperation typeOperation = new TypeOperation()
            .libelle(UPDATED_LIBELLE)
            .dateHeureModification(UPDATED_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(UPDATED_DATE_HEURE_CREATION)
            .utiCree(UPDATED_UTI_CREE)
            .utiModifie(UPDATED_UTI_MODIFIE);
        return typeOperation;
    }

    @BeforeEach
    public void initTest() {
        typeOperation = createEntity(em);
    }

    @Test
    @Transactional
    void createTypeOperation() throws Exception {
        int databaseSizeBeforeCreate = typeOperationRepository.findAll().size();
        // Create the TypeOperation
        TypeOperationDTO typeOperationDTO = typeOperationMapper.toDto(typeOperation);
        restTypeOperationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(typeOperationDTO))
            )
            .andExpect(status().isCreated());

        // Validate the TypeOperation in the database
        List<TypeOperation> typeOperationList = typeOperationRepository.findAll();
        assertThat(typeOperationList).hasSize(databaseSizeBeforeCreate + 1);
        TypeOperation testTypeOperation = typeOperationList.get(typeOperationList.size() - 1);
        assertThat(testTypeOperation.getLibelle()).isEqualTo(DEFAULT_LIBELLE);
        assertThat(testTypeOperation.getDateHeureModification()).isEqualTo(DEFAULT_DATE_HEURE_MODIFICATION);
        assertThat(testTypeOperation.getDateHeureCreation()).isEqualTo(DEFAULT_DATE_HEURE_CREATION);
        assertThat(testTypeOperation.getUtiCree()).isEqualTo(DEFAULT_UTI_CREE);
        assertThat(testTypeOperation.getUtiModifie()).isEqualTo(DEFAULT_UTI_MODIFIE);
    }

    @Test
    @Transactional
    void createTypeOperationWithExistingId() throws Exception {
        // Create the TypeOperation with an existing ID
        typeOperation.setId(1L);
        TypeOperationDTO typeOperationDTO = typeOperationMapper.toDto(typeOperation);

        int databaseSizeBeforeCreate = typeOperationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTypeOperationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(typeOperationDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypeOperation in the database
        List<TypeOperation> typeOperationList = typeOperationRepository.findAll();
        assertThat(typeOperationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTypeOperations() throws Exception {
        // Initialize the database
        typeOperationRepository.saveAndFlush(typeOperation);

        // Get all the typeOperationList
        restTypeOperationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(typeOperation.getId().intValue())))
            .andExpect(jsonPath("$.[*].libelle").value(hasItem(DEFAULT_LIBELLE)))
            .andExpect(jsonPath("$.[*].dateHeureModification").value(hasItem(DEFAULT_DATE_HEURE_MODIFICATION.toString())))
            .andExpect(jsonPath("$.[*].dateHeureCreation").value(hasItem(DEFAULT_DATE_HEURE_CREATION.toString())))
            .andExpect(jsonPath("$.[*].utiCree").value(hasItem(DEFAULT_UTI_CREE.intValue())))
            .andExpect(jsonPath("$.[*].utiModifie").value(hasItem(DEFAULT_UTI_MODIFIE.intValue())));
    }

    @Test
    @Transactional
    void getTypeOperation() throws Exception {
        // Initialize the database
        typeOperationRepository.saveAndFlush(typeOperation);

        // Get the typeOperation
        restTypeOperationMockMvc
            .perform(get(ENTITY_API_URL_ID, typeOperation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(typeOperation.getId().intValue()))
            .andExpect(jsonPath("$.libelle").value(DEFAULT_LIBELLE))
            .andExpect(jsonPath("$.dateHeureModification").value(DEFAULT_DATE_HEURE_MODIFICATION.toString()))
            .andExpect(jsonPath("$.dateHeureCreation").value(DEFAULT_DATE_HEURE_CREATION.toString()))
            .andExpect(jsonPath("$.utiCree").value(DEFAULT_UTI_CREE.intValue()))
            .andExpect(jsonPath("$.utiModifie").value(DEFAULT_UTI_MODIFIE.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingTypeOperation() throws Exception {
        // Get the typeOperation
        restTypeOperationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTypeOperation() throws Exception {
        // Initialize the database
        typeOperationRepository.saveAndFlush(typeOperation);

        int databaseSizeBeforeUpdate = typeOperationRepository.findAll().size();

        // Update the typeOperation
        TypeOperation updatedTypeOperation = typeOperationRepository.findById(typeOperation.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedTypeOperation are not directly saved in db
        em.detach(updatedTypeOperation);
        updatedTypeOperation
            .libelle(UPDATED_LIBELLE)
            .dateHeureModification(UPDATED_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(UPDATED_DATE_HEURE_CREATION)
            .utiCree(UPDATED_UTI_CREE)
            .utiModifie(UPDATED_UTI_MODIFIE);
        TypeOperationDTO typeOperationDTO = typeOperationMapper.toDto(updatedTypeOperation);

        restTypeOperationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, typeOperationDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(typeOperationDTO))
            )
            .andExpect(status().isOk());

        // Validate the TypeOperation in the database
        List<TypeOperation> typeOperationList = typeOperationRepository.findAll();
        assertThat(typeOperationList).hasSize(databaseSizeBeforeUpdate);
        TypeOperation testTypeOperation = typeOperationList.get(typeOperationList.size() - 1);
        assertThat(testTypeOperation.getLibelle()).isEqualTo(UPDATED_LIBELLE);
        assertThat(testTypeOperation.getDateHeureModification()).isEqualTo(UPDATED_DATE_HEURE_MODIFICATION);
        assertThat(testTypeOperation.getDateHeureCreation()).isEqualTo(UPDATED_DATE_HEURE_CREATION);
        assertThat(testTypeOperation.getUtiCree()).isEqualTo(UPDATED_UTI_CREE);
        assertThat(testTypeOperation.getUtiModifie()).isEqualTo(UPDATED_UTI_MODIFIE);
    }

    @Test
    @Transactional
    void putNonExistingTypeOperation() throws Exception {
        int databaseSizeBeforeUpdate = typeOperationRepository.findAll().size();
        typeOperation.setId(longCount.incrementAndGet());

        // Create the TypeOperation
        TypeOperationDTO typeOperationDTO = typeOperationMapper.toDto(typeOperation);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTypeOperationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, typeOperationDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(typeOperationDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypeOperation in the database
        List<TypeOperation> typeOperationList = typeOperationRepository.findAll();
        assertThat(typeOperationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTypeOperation() throws Exception {
        int databaseSizeBeforeUpdate = typeOperationRepository.findAll().size();
        typeOperation.setId(longCount.incrementAndGet());

        // Create the TypeOperation
        TypeOperationDTO typeOperationDTO = typeOperationMapper.toDto(typeOperation);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypeOperationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(typeOperationDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypeOperation in the database
        List<TypeOperation> typeOperationList = typeOperationRepository.findAll();
        assertThat(typeOperationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTypeOperation() throws Exception {
        int databaseSizeBeforeUpdate = typeOperationRepository.findAll().size();
        typeOperation.setId(longCount.incrementAndGet());

        // Create the TypeOperation
        TypeOperationDTO typeOperationDTO = typeOperationMapper.toDto(typeOperation);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypeOperationMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(typeOperationDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TypeOperation in the database
        List<TypeOperation> typeOperationList = typeOperationRepository.findAll();
        assertThat(typeOperationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTypeOperationWithPatch() throws Exception {
        // Initialize the database
        typeOperationRepository.saveAndFlush(typeOperation);

        int databaseSizeBeforeUpdate = typeOperationRepository.findAll().size();

        // Update the typeOperation using partial update
        TypeOperation partialUpdatedTypeOperation = new TypeOperation();
        partialUpdatedTypeOperation.setId(typeOperation.getId());

        partialUpdatedTypeOperation
            .dateHeureModification(UPDATED_DATE_HEURE_MODIFICATION)
            .utiCree(UPDATED_UTI_CREE)
            .utiModifie(UPDATED_UTI_MODIFIE);

        restTypeOperationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTypeOperation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTypeOperation))
            )
            .andExpect(status().isOk());

        // Validate the TypeOperation in the database
        List<TypeOperation> typeOperationList = typeOperationRepository.findAll();
        assertThat(typeOperationList).hasSize(databaseSizeBeforeUpdate);
        TypeOperation testTypeOperation = typeOperationList.get(typeOperationList.size() - 1);
        assertThat(testTypeOperation.getLibelle()).isEqualTo(DEFAULT_LIBELLE);
        assertThat(testTypeOperation.getDateHeureModification()).isEqualTo(UPDATED_DATE_HEURE_MODIFICATION);
        assertThat(testTypeOperation.getDateHeureCreation()).isEqualTo(DEFAULT_DATE_HEURE_CREATION);
        assertThat(testTypeOperation.getUtiCree()).isEqualTo(UPDATED_UTI_CREE);
        assertThat(testTypeOperation.getUtiModifie()).isEqualTo(UPDATED_UTI_MODIFIE);
    }

    @Test
    @Transactional
    void fullUpdateTypeOperationWithPatch() throws Exception {
        // Initialize the database
        typeOperationRepository.saveAndFlush(typeOperation);

        int databaseSizeBeforeUpdate = typeOperationRepository.findAll().size();

        // Update the typeOperation using partial update
        TypeOperation partialUpdatedTypeOperation = new TypeOperation();
        partialUpdatedTypeOperation.setId(typeOperation.getId());

        partialUpdatedTypeOperation
            .libelle(UPDATED_LIBELLE)
            .dateHeureModification(UPDATED_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(UPDATED_DATE_HEURE_CREATION)
            .utiCree(UPDATED_UTI_CREE)
            .utiModifie(UPDATED_UTI_MODIFIE);

        restTypeOperationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTypeOperation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTypeOperation))
            )
            .andExpect(status().isOk());

        // Validate the TypeOperation in the database
        List<TypeOperation> typeOperationList = typeOperationRepository.findAll();
        assertThat(typeOperationList).hasSize(databaseSizeBeforeUpdate);
        TypeOperation testTypeOperation = typeOperationList.get(typeOperationList.size() - 1);
        assertThat(testTypeOperation.getLibelle()).isEqualTo(UPDATED_LIBELLE);
        assertThat(testTypeOperation.getDateHeureModification()).isEqualTo(UPDATED_DATE_HEURE_MODIFICATION);
        assertThat(testTypeOperation.getDateHeureCreation()).isEqualTo(UPDATED_DATE_HEURE_CREATION);
        assertThat(testTypeOperation.getUtiCree()).isEqualTo(UPDATED_UTI_CREE);
        assertThat(testTypeOperation.getUtiModifie()).isEqualTo(UPDATED_UTI_MODIFIE);
    }

    @Test
    @Transactional
    void patchNonExistingTypeOperation() throws Exception {
        int databaseSizeBeforeUpdate = typeOperationRepository.findAll().size();
        typeOperation.setId(longCount.incrementAndGet());

        // Create the TypeOperation
        TypeOperationDTO typeOperationDTO = typeOperationMapper.toDto(typeOperation);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTypeOperationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, typeOperationDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(typeOperationDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypeOperation in the database
        List<TypeOperation> typeOperationList = typeOperationRepository.findAll();
        assertThat(typeOperationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTypeOperation() throws Exception {
        int databaseSizeBeforeUpdate = typeOperationRepository.findAll().size();
        typeOperation.setId(longCount.incrementAndGet());

        // Create the TypeOperation
        TypeOperationDTO typeOperationDTO = typeOperationMapper.toDto(typeOperation);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypeOperationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(typeOperationDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypeOperation in the database
        List<TypeOperation> typeOperationList = typeOperationRepository.findAll();
        assertThat(typeOperationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTypeOperation() throws Exception {
        int databaseSizeBeforeUpdate = typeOperationRepository.findAll().size();
        typeOperation.setId(longCount.incrementAndGet());

        // Create the TypeOperation
        TypeOperationDTO typeOperationDTO = typeOperationMapper.toDto(typeOperation);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypeOperationMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(typeOperationDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TypeOperation in the database
        List<TypeOperation> typeOperationList = typeOperationRepository.findAll();
        assertThat(typeOperationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTypeOperation() throws Exception {
        // Initialize the database
        typeOperationRepository.saveAndFlush(typeOperation);

        int databaseSizeBeforeDelete = typeOperationRepository.findAll().size();

        // Delete the typeOperation
        restTypeOperationMockMvc
            .perform(delete(ENTITY_API_URL_ID, typeOperation.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<TypeOperation> typeOperationList = typeOperationRepository.findAll();
        assertThat(typeOperationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
