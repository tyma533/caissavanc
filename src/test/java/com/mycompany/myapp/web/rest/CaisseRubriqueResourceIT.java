package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.CaisseRubrique;
import com.mycompany.myapp.repository.CaisseRubriqueRepository;
import com.mycompany.myapp.service.dto.CaisseRubriqueDTO;
import com.mycompany.myapp.service.mapper.CaisseRubriqueMapper;
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
 * Integration tests for the {@link CaisseRubriqueResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CaisseRubriqueResourceIT {

    private static final Instant DEFAULT_DATE_HEURE_MODIFICATION = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_HEURE_MODIFICATION = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_DATE_HEURE_CREATION = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_HEURE_CREATION = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Long DEFAULT_UTI_CREE = 1L;
    private static final Long UPDATED_UTI_CREE = 2L;

    private static final Long DEFAULT_UTI_MODIFIE = 1L;
    private static final Long UPDATED_UTI_MODIFIE = 2L;

    private static final String ENTITY_API_URL = "/api/caisse-rubriques";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CaisseRubriqueRepository caisseRubriqueRepository;

    @Autowired
    private CaisseRubriqueMapper caisseRubriqueMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCaisseRubriqueMockMvc;

    private CaisseRubrique caisseRubrique;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CaisseRubrique createEntity(EntityManager em) {
        CaisseRubrique caisseRubrique = new CaisseRubrique()
            .dateHeureModification(DEFAULT_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(DEFAULT_DATE_HEURE_CREATION)
            .utiCree(DEFAULT_UTI_CREE)
            .utiModifie(DEFAULT_UTI_MODIFIE);
        return caisseRubrique;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CaisseRubrique createUpdatedEntity(EntityManager em) {
        CaisseRubrique caisseRubrique = new CaisseRubrique()
            .dateHeureModification(UPDATED_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(UPDATED_DATE_HEURE_CREATION)
            .utiCree(UPDATED_UTI_CREE)
            .utiModifie(UPDATED_UTI_MODIFIE);
        return caisseRubrique;
    }

    @BeforeEach
    public void initTest() {
        caisseRubrique = createEntity(em);
    }

    @Test
    @Transactional
    void createCaisseRubrique() throws Exception {
        int databaseSizeBeforeCreate = caisseRubriqueRepository.findAll().size();
        // Create the CaisseRubrique
        CaisseRubriqueDTO caisseRubriqueDTO = caisseRubriqueMapper.toDto(caisseRubrique);
        restCaisseRubriqueMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(caisseRubriqueDTO))
            )
            .andExpect(status().isCreated());

        // Validate the CaisseRubrique in the database
        List<CaisseRubrique> caisseRubriqueList = caisseRubriqueRepository.findAll();
        assertThat(caisseRubriqueList).hasSize(databaseSizeBeforeCreate + 1);
        CaisseRubrique testCaisseRubrique = caisseRubriqueList.get(caisseRubriqueList.size() - 1);
        assertThat(testCaisseRubrique.getDateHeureModification()).isEqualTo(DEFAULT_DATE_HEURE_MODIFICATION);
        assertThat(testCaisseRubrique.getDateHeureCreation()).isEqualTo(DEFAULT_DATE_HEURE_CREATION);
        assertThat(testCaisseRubrique.getUtiCree()).isEqualTo(DEFAULT_UTI_CREE);
        assertThat(testCaisseRubrique.getUtiModifie()).isEqualTo(DEFAULT_UTI_MODIFIE);
    }

    @Test
    @Transactional
    void createCaisseRubriqueWithExistingId() throws Exception {
        // Create the CaisseRubrique with an existing ID
        caisseRubrique.setId(1L);
        CaisseRubriqueDTO caisseRubriqueDTO = caisseRubriqueMapper.toDto(caisseRubrique);

        int databaseSizeBeforeCreate = caisseRubriqueRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCaisseRubriqueMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(caisseRubriqueDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the CaisseRubrique in the database
        List<CaisseRubrique> caisseRubriqueList = caisseRubriqueRepository.findAll();
        assertThat(caisseRubriqueList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCaisseRubriques() throws Exception {
        // Initialize the database
        caisseRubriqueRepository.saveAndFlush(caisseRubrique);

        // Get all the caisseRubriqueList
        restCaisseRubriqueMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(caisseRubrique.getId().intValue())))
            .andExpect(jsonPath("$.[*].dateHeureModification").value(hasItem(DEFAULT_DATE_HEURE_MODIFICATION.toString())))
            .andExpect(jsonPath("$.[*].dateHeureCreation").value(hasItem(DEFAULT_DATE_HEURE_CREATION.toString())))
            .andExpect(jsonPath("$.[*].utiCree").value(hasItem(DEFAULT_UTI_CREE.intValue())))
            .andExpect(jsonPath("$.[*].utiModifie").value(hasItem(DEFAULT_UTI_MODIFIE.intValue())));
    }

    @Test
    @Transactional
    void getCaisseRubrique() throws Exception {
        // Initialize the database
        caisseRubriqueRepository.saveAndFlush(caisseRubrique);

        // Get the caisseRubrique
        restCaisseRubriqueMockMvc
            .perform(get(ENTITY_API_URL_ID, caisseRubrique.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(caisseRubrique.getId().intValue()))
            .andExpect(jsonPath("$.dateHeureModification").value(DEFAULT_DATE_HEURE_MODIFICATION.toString()))
            .andExpect(jsonPath("$.dateHeureCreation").value(DEFAULT_DATE_HEURE_CREATION.toString()))
            .andExpect(jsonPath("$.utiCree").value(DEFAULT_UTI_CREE.intValue()))
            .andExpect(jsonPath("$.utiModifie").value(DEFAULT_UTI_MODIFIE.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingCaisseRubrique() throws Exception {
        // Get the caisseRubrique
        restCaisseRubriqueMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCaisseRubrique() throws Exception {
        // Initialize the database
        caisseRubriqueRepository.saveAndFlush(caisseRubrique);

        int databaseSizeBeforeUpdate = caisseRubriqueRepository.findAll().size();

        // Update the caisseRubrique
        CaisseRubrique updatedCaisseRubrique = caisseRubriqueRepository.findById(caisseRubrique.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedCaisseRubrique are not directly saved in db
        em.detach(updatedCaisseRubrique);
        updatedCaisseRubrique
            .dateHeureModification(UPDATED_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(UPDATED_DATE_HEURE_CREATION)
            .utiCree(UPDATED_UTI_CREE)
            .utiModifie(UPDATED_UTI_MODIFIE);
        CaisseRubriqueDTO caisseRubriqueDTO = caisseRubriqueMapper.toDto(updatedCaisseRubrique);

        restCaisseRubriqueMockMvc
            .perform(
                put(ENTITY_API_URL_ID, caisseRubriqueDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(caisseRubriqueDTO))
            )
            .andExpect(status().isOk());

        // Validate the CaisseRubrique in the database
        List<CaisseRubrique> caisseRubriqueList = caisseRubriqueRepository.findAll();
        assertThat(caisseRubriqueList).hasSize(databaseSizeBeforeUpdate);
        CaisseRubrique testCaisseRubrique = caisseRubriqueList.get(caisseRubriqueList.size() - 1);
        assertThat(testCaisseRubrique.getDateHeureModification()).isEqualTo(UPDATED_DATE_HEURE_MODIFICATION);
        assertThat(testCaisseRubrique.getDateHeureCreation()).isEqualTo(UPDATED_DATE_HEURE_CREATION);
        assertThat(testCaisseRubrique.getUtiCree()).isEqualTo(UPDATED_UTI_CREE);
        assertThat(testCaisseRubrique.getUtiModifie()).isEqualTo(UPDATED_UTI_MODIFIE);
    }

    @Test
    @Transactional
    void putNonExistingCaisseRubrique() throws Exception {
        int databaseSizeBeforeUpdate = caisseRubriqueRepository.findAll().size();
        caisseRubrique.setId(longCount.incrementAndGet());

        // Create the CaisseRubrique
        CaisseRubriqueDTO caisseRubriqueDTO = caisseRubriqueMapper.toDto(caisseRubrique);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCaisseRubriqueMockMvc
            .perform(
                put(ENTITY_API_URL_ID, caisseRubriqueDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(caisseRubriqueDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the CaisseRubrique in the database
        List<CaisseRubrique> caisseRubriqueList = caisseRubriqueRepository.findAll();
        assertThat(caisseRubriqueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCaisseRubrique() throws Exception {
        int databaseSizeBeforeUpdate = caisseRubriqueRepository.findAll().size();
        caisseRubrique.setId(longCount.incrementAndGet());

        // Create the CaisseRubrique
        CaisseRubriqueDTO caisseRubriqueDTO = caisseRubriqueMapper.toDto(caisseRubrique);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCaisseRubriqueMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(caisseRubriqueDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the CaisseRubrique in the database
        List<CaisseRubrique> caisseRubriqueList = caisseRubriqueRepository.findAll();
        assertThat(caisseRubriqueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCaisseRubrique() throws Exception {
        int databaseSizeBeforeUpdate = caisseRubriqueRepository.findAll().size();
        caisseRubrique.setId(longCount.incrementAndGet());

        // Create the CaisseRubrique
        CaisseRubriqueDTO caisseRubriqueDTO = caisseRubriqueMapper.toDto(caisseRubrique);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCaisseRubriqueMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(caisseRubriqueDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CaisseRubrique in the database
        List<CaisseRubrique> caisseRubriqueList = caisseRubriqueRepository.findAll();
        assertThat(caisseRubriqueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCaisseRubriqueWithPatch() throws Exception {
        // Initialize the database
        caisseRubriqueRepository.saveAndFlush(caisseRubrique);

        int databaseSizeBeforeUpdate = caisseRubriqueRepository.findAll().size();

        // Update the caisseRubrique using partial update
        CaisseRubrique partialUpdatedCaisseRubrique = new CaisseRubrique();
        partialUpdatedCaisseRubrique.setId(caisseRubrique.getId());

        partialUpdatedCaisseRubrique.dateHeureCreation(UPDATED_DATE_HEURE_CREATION);

        restCaisseRubriqueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCaisseRubrique.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCaisseRubrique))
            )
            .andExpect(status().isOk());

        // Validate the CaisseRubrique in the database
        List<CaisseRubrique> caisseRubriqueList = caisseRubriqueRepository.findAll();
        assertThat(caisseRubriqueList).hasSize(databaseSizeBeforeUpdate);
        CaisseRubrique testCaisseRubrique = caisseRubriqueList.get(caisseRubriqueList.size() - 1);
        assertThat(testCaisseRubrique.getDateHeureModification()).isEqualTo(DEFAULT_DATE_HEURE_MODIFICATION);
        assertThat(testCaisseRubrique.getDateHeureCreation()).isEqualTo(UPDATED_DATE_HEURE_CREATION);
        assertThat(testCaisseRubrique.getUtiCree()).isEqualTo(DEFAULT_UTI_CREE);
        assertThat(testCaisseRubrique.getUtiModifie()).isEqualTo(DEFAULT_UTI_MODIFIE);
    }

    @Test
    @Transactional
    void fullUpdateCaisseRubriqueWithPatch() throws Exception {
        // Initialize the database
        caisseRubriqueRepository.saveAndFlush(caisseRubrique);

        int databaseSizeBeforeUpdate = caisseRubriqueRepository.findAll().size();

        // Update the caisseRubrique using partial update
        CaisseRubrique partialUpdatedCaisseRubrique = new CaisseRubrique();
        partialUpdatedCaisseRubrique.setId(caisseRubrique.getId());

        partialUpdatedCaisseRubrique
            .dateHeureModification(UPDATED_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(UPDATED_DATE_HEURE_CREATION)
            .utiCree(UPDATED_UTI_CREE)
            .utiModifie(UPDATED_UTI_MODIFIE);

        restCaisseRubriqueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCaisseRubrique.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCaisseRubrique))
            )
            .andExpect(status().isOk());

        // Validate the CaisseRubrique in the database
        List<CaisseRubrique> caisseRubriqueList = caisseRubriqueRepository.findAll();
        assertThat(caisseRubriqueList).hasSize(databaseSizeBeforeUpdate);
        CaisseRubrique testCaisseRubrique = caisseRubriqueList.get(caisseRubriqueList.size() - 1);
        assertThat(testCaisseRubrique.getDateHeureModification()).isEqualTo(UPDATED_DATE_HEURE_MODIFICATION);
        assertThat(testCaisseRubrique.getDateHeureCreation()).isEqualTo(UPDATED_DATE_HEURE_CREATION);
        assertThat(testCaisseRubrique.getUtiCree()).isEqualTo(UPDATED_UTI_CREE);
        assertThat(testCaisseRubrique.getUtiModifie()).isEqualTo(UPDATED_UTI_MODIFIE);
    }

    @Test
    @Transactional
    void patchNonExistingCaisseRubrique() throws Exception {
        int databaseSizeBeforeUpdate = caisseRubriqueRepository.findAll().size();
        caisseRubrique.setId(longCount.incrementAndGet());

        // Create the CaisseRubrique
        CaisseRubriqueDTO caisseRubriqueDTO = caisseRubriqueMapper.toDto(caisseRubrique);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCaisseRubriqueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, caisseRubriqueDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(caisseRubriqueDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the CaisseRubrique in the database
        List<CaisseRubrique> caisseRubriqueList = caisseRubriqueRepository.findAll();
        assertThat(caisseRubriqueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCaisseRubrique() throws Exception {
        int databaseSizeBeforeUpdate = caisseRubriqueRepository.findAll().size();
        caisseRubrique.setId(longCount.incrementAndGet());

        // Create the CaisseRubrique
        CaisseRubriqueDTO caisseRubriqueDTO = caisseRubriqueMapper.toDto(caisseRubrique);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCaisseRubriqueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(caisseRubriqueDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the CaisseRubrique in the database
        List<CaisseRubrique> caisseRubriqueList = caisseRubriqueRepository.findAll();
        assertThat(caisseRubriqueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCaisseRubrique() throws Exception {
        int databaseSizeBeforeUpdate = caisseRubriqueRepository.findAll().size();
        caisseRubrique.setId(longCount.incrementAndGet());

        // Create the CaisseRubrique
        CaisseRubriqueDTO caisseRubriqueDTO = caisseRubriqueMapper.toDto(caisseRubrique);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCaisseRubriqueMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(caisseRubriqueDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CaisseRubrique in the database
        List<CaisseRubrique> caisseRubriqueList = caisseRubriqueRepository.findAll();
        assertThat(caisseRubriqueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCaisseRubrique() throws Exception {
        // Initialize the database
        caisseRubriqueRepository.saveAndFlush(caisseRubrique);

        int databaseSizeBeforeDelete = caisseRubriqueRepository.findAll().size();

        // Delete the caisseRubrique
        restCaisseRubriqueMockMvc
            .perform(delete(ENTITY_API_URL_ID, caisseRubrique.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CaisseRubrique> caisseRubriqueList = caisseRubriqueRepository.findAll();
        assertThat(caisseRubriqueList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
