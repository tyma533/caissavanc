package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Rubrique;
import com.mycompany.myapp.repository.RubriqueRepository;
import com.mycompany.myapp.service.dto.RubriqueDTO;
import com.mycompany.myapp.service.mapper.RubriqueMapper;
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
 * Integration tests for the {@link RubriqueResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class RubriqueResourceIT {

    private static final String DEFAULT_LIBELLE = "AAAAAAAAAA";
    private static final String UPDATED_LIBELLE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final Instant DEFAULT_DATE_HEURE_MODIFICATION = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_HEURE_MODIFICATION = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_DATE_HEURE_CREATION = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_HEURE_CREATION = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Long DEFAULT_UTI_CREE = 1L;
    private static final Long UPDATED_UTI_CREE = 2L;

    private static final Long DEFAULT_UTI_MODIFIE = 1L;
    private static final Long UPDATED_UTI_MODIFIE = 2L;

    private static final String ENTITY_API_URL = "/api/rubriques";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private RubriqueRepository rubriqueRepository;

    @Autowired
    private RubriqueMapper rubriqueMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRubriqueMockMvc;

    private Rubrique rubrique;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Rubrique createEntity(EntityManager em) {
        Rubrique rubrique = new Rubrique()
            .libelle(DEFAULT_LIBELLE)
            .description(DEFAULT_DESCRIPTION)
            .code(DEFAULT_CODE)
            .dateHeureModification(DEFAULT_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(DEFAULT_DATE_HEURE_CREATION)
            .utiCree(DEFAULT_UTI_CREE)
            .utiModifie(DEFAULT_UTI_MODIFIE);
        return rubrique;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Rubrique createUpdatedEntity(EntityManager em) {
        Rubrique rubrique = new Rubrique()
            .libelle(UPDATED_LIBELLE)
            .description(UPDATED_DESCRIPTION)
            .code(UPDATED_CODE)
            .dateHeureModification(UPDATED_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(UPDATED_DATE_HEURE_CREATION)
            .utiCree(UPDATED_UTI_CREE)
            .utiModifie(UPDATED_UTI_MODIFIE);
        return rubrique;
    }

    @BeforeEach
    public void initTest() {
        rubrique = createEntity(em);
    }

    @Test
    @Transactional
    void createRubrique() throws Exception {
        int databaseSizeBeforeCreate = rubriqueRepository.findAll().size();
        // Create the Rubrique
        RubriqueDTO rubriqueDTO = rubriqueMapper.toDto(rubrique);
        restRubriqueMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(rubriqueDTO)))
            .andExpect(status().isCreated());

        // Validate the Rubrique in the database
        List<Rubrique> rubriqueList = rubriqueRepository.findAll();
        assertThat(rubriqueList).hasSize(databaseSizeBeforeCreate + 1);
        Rubrique testRubrique = rubriqueList.get(rubriqueList.size() - 1);
        assertThat(testRubrique.getLibelle()).isEqualTo(DEFAULT_LIBELLE);
        assertThat(testRubrique.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testRubrique.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testRubrique.getDateHeureModification()).isEqualTo(DEFAULT_DATE_HEURE_MODIFICATION);
        assertThat(testRubrique.getDateHeureCreation()).isEqualTo(DEFAULT_DATE_HEURE_CREATION);
        assertThat(testRubrique.getUtiCree()).isEqualTo(DEFAULT_UTI_CREE);
        assertThat(testRubrique.getUtiModifie()).isEqualTo(DEFAULT_UTI_MODIFIE);
    }

    @Test
    @Transactional
    void createRubriqueWithExistingId() throws Exception {
        // Create the Rubrique with an existing ID
        rubrique.setId(1L);
        RubriqueDTO rubriqueDTO = rubriqueMapper.toDto(rubrique);

        int databaseSizeBeforeCreate = rubriqueRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRubriqueMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(rubriqueDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Rubrique in the database
        List<Rubrique> rubriqueList = rubriqueRepository.findAll();
        assertThat(rubriqueList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllRubriques() throws Exception {
        // Initialize the database
        rubriqueRepository.saveAndFlush(rubrique);

        // Get all the rubriqueList
        restRubriqueMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(rubrique.getId().intValue())))
            .andExpect(jsonPath("$.[*].libelle").value(hasItem(DEFAULT_LIBELLE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].dateHeureModification").value(hasItem(DEFAULT_DATE_HEURE_MODIFICATION.toString())))
            .andExpect(jsonPath("$.[*].dateHeureCreation").value(hasItem(DEFAULT_DATE_HEURE_CREATION.toString())))
            .andExpect(jsonPath("$.[*].utiCree").value(hasItem(DEFAULT_UTI_CREE.intValue())))
            .andExpect(jsonPath("$.[*].utiModifie").value(hasItem(DEFAULT_UTI_MODIFIE.intValue())));
    }

    @Test
    @Transactional
    void getRubrique() throws Exception {
        // Initialize the database
        rubriqueRepository.saveAndFlush(rubrique);

        // Get the rubrique
        restRubriqueMockMvc
            .perform(get(ENTITY_API_URL_ID, rubrique.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(rubrique.getId().intValue()))
            .andExpect(jsonPath("$.libelle").value(DEFAULT_LIBELLE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE))
            .andExpect(jsonPath("$.dateHeureModification").value(DEFAULT_DATE_HEURE_MODIFICATION.toString()))
            .andExpect(jsonPath("$.dateHeureCreation").value(DEFAULT_DATE_HEURE_CREATION.toString()))
            .andExpect(jsonPath("$.utiCree").value(DEFAULT_UTI_CREE.intValue()))
            .andExpect(jsonPath("$.utiModifie").value(DEFAULT_UTI_MODIFIE.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingRubrique() throws Exception {
        // Get the rubrique
        restRubriqueMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingRubrique() throws Exception {
        // Initialize the database
        rubriqueRepository.saveAndFlush(rubrique);

        int databaseSizeBeforeUpdate = rubriqueRepository.findAll().size();

        // Update the rubrique
        Rubrique updatedRubrique = rubriqueRepository.findById(rubrique.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedRubrique are not directly saved in db
        em.detach(updatedRubrique);
        updatedRubrique
            .libelle(UPDATED_LIBELLE)
            .description(UPDATED_DESCRIPTION)
            .code(UPDATED_CODE)
            .dateHeureModification(UPDATED_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(UPDATED_DATE_HEURE_CREATION)
            .utiCree(UPDATED_UTI_CREE)
            .utiModifie(UPDATED_UTI_MODIFIE);
        RubriqueDTO rubriqueDTO = rubriqueMapper.toDto(updatedRubrique);

        restRubriqueMockMvc
            .perform(
                put(ENTITY_API_URL_ID, rubriqueDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rubriqueDTO))
            )
            .andExpect(status().isOk());

        // Validate the Rubrique in the database
        List<Rubrique> rubriqueList = rubriqueRepository.findAll();
        assertThat(rubriqueList).hasSize(databaseSizeBeforeUpdate);
        Rubrique testRubrique = rubriqueList.get(rubriqueList.size() - 1);
        assertThat(testRubrique.getLibelle()).isEqualTo(UPDATED_LIBELLE);
        assertThat(testRubrique.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testRubrique.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testRubrique.getDateHeureModification()).isEqualTo(UPDATED_DATE_HEURE_MODIFICATION);
        assertThat(testRubrique.getDateHeureCreation()).isEqualTo(UPDATED_DATE_HEURE_CREATION);
        assertThat(testRubrique.getUtiCree()).isEqualTo(UPDATED_UTI_CREE);
        assertThat(testRubrique.getUtiModifie()).isEqualTo(UPDATED_UTI_MODIFIE);
    }

    @Test
    @Transactional
    void putNonExistingRubrique() throws Exception {
        int databaseSizeBeforeUpdate = rubriqueRepository.findAll().size();
        rubrique.setId(longCount.incrementAndGet());

        // Create the Rubrique
        RubriqueDTO rubriqueDTO = rubriqueMapper.toDto(rubrique);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRubriqueMockMvc
            .perform(
                put(ENTITY_API_URL_ID, rubriqueDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rubriqueDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Rubrique in the database
        List<Rubrique> rubriqueList = rubriqueRepository.findAll();
        assertThat(rubriqueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRubrique() throws Exception {
        int databaseSizeBeforeUpdate = rubriqueRepository.findAll().size();
        rubrique.setId(longCount.incrementAndGet());

        // Create the Rubrique
        RubriqueDTO rubriqueDTO = rubriqueMapper.toDto(rubrique);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRubriqueMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rubriqueDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Rubrique in the database
        List<Rubrique> rubriqueList = rubriqueRepository.findAll();
        assertThat(rubriqueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRubrique() throws Exception {
        int databaseSizeBeforeUpdate = rubriqueRepository.findAll().size();
        rubrique.setId(longCount.incrementAndGet());

        // Create the Rubrique
        RubriqueDTO rubriqueDTO = rubriqueMapper.toDto(rubrique);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRubriqueMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(rubriqueDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Rubrique in the database
        List<Rubrique> rubriqueList = rubriqueRepository.findAll();
        assertThat(rubriqueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRubriqueWithPatch() throws Exception {
        // Initialize the database
        rubriqueRepository.saveAndFlush(rubrique);

        int databaseSizeBeforeUpdate = rubriqueRepository.findAll().size();

        // Update the rubrique using partial update
        Rubrique partialUpdatedRubrique = new Rubrique();
        partialUpdatedRubrique.setId(rubrique.getId());

        partialUpdatedRubrique
            .description(UPDATED_DESCRIPTION)
            .code(UPDATED_CODE)
            .dateHeureModification(UPDATED_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(UPDATED_DATE_HEURE_CREATION)
            .utiCree(UPDATED_UTI_CREE);

        restRubriqueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRubrique.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRubrique))
            )
            .andExpect(status().isOk());

        // Validate the Rubrique in the database
        List<Rubrique> rubriqueList = rubriqueRepository.findAll();
        assertThat(rubriqueList).hasSize(databaseSizeBeforeUpdate);
        Rubrique testRubrique = rubriqueList.get(rubriqueList.size() - 1);
        assertThat(testRubrique.getLibelle()).isEqualTo(DEFAULT_LIBELLE);
        assertThat(testRubrique.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testRubrique.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testRubrique.getDateHeureModification()).isEqualTo(UPDATED_DATE_HEURE_MODIFICATION);
        assertThat(testRubrique.getDateHeureCreation()).isEqualTo(UPDATED_DATE_HEURE_CREATION);
        assertThat(testRubrique.getUtiCree()).isEqualTo(UPDATED_UTI_CREE);
        assertThat(testRubrique.getUtiModifie()).isEqualTo(DEFAULT_UTI_MODIFIE);
    }

    @Test
    @Transactional
    void fullUpdateRubriqueWithPatch() throws Exception {
        // Initialize the database
        rubriqueRepository.saveAndFlush(rubrique);

        int databaseSizeBeforeUpdate = rubriqueRepository.findAll().size();

        // Update the rubrique using partial update
        Rubrique partialUpdatedRubrique = new Rubrique();
        partialUpdatedRubrique.setId(rubrique.getId());

        partialUpdatedRubrique
            .libelle(UPDATED_LIBELLE)
            .description(UPDATED_DESCRIPTION)
            .code(UPDATED_CODE)
            .dateHeureModification(UPDATED_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(UPDATED_DATE_HEURE_CREATION)
            .utiCree(UPDATED_UTI_CREE)
            .utiModifie(UPDATED_UTI_MODIFIE);

        restRubriqueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRubrique.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRubrique))
            )
            .andExpect(status().isOk());

        // Validate the Rubrique in the database
        List<Rubrique> rubriqueList = rubriqueRepository.findAll();
        assertThat(rubriqueList).hasSize(databaseSizeBeforeUpdate);
        Rubrique testRubrique = rubriqueList.get(rubriqueList.size() - 1);
        assertThat(testRubrique.getLibelle()).isEqualTo(UPDATED_LIBELLE);
        assertThat(testRubrique.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testRubrique.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testRubrique.getDateHeureModification()).isEqualTo(UPDATED_DATE_HEURE_MODIFICATION);
        assertThat(testRubrique.getDateHeureCreation()).isEqualTo(UPDATED_DATE_HEURE_CREATION);
        assertThat(testRubrique.getUtiCree()).isEqualTo(UPDATED_UTI_CREE);
        assertThat(testRubrique.getUtiModifie()).isEqualTo(UPDATED_UTI_MODIFIE);
    }

    @Test
    @Transactional
    void patchNonExistingRubrique() throws Exception {
        int databaseSizeBeforeUpdate = rubriqueRepository.findAll().size();
        rubrique.setId(longCount.incrementAndGet());

        // Create the Rubrique
        RubriqueDTO rubriqueDTO = rubriqueMapper.toDto(rubrique);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRubriqueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, rubriqueDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(rubriqueDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Rubrique in the database
        List<Rubrique> rubriqueList = rubriqueRepository.findAll();
        assertThat(rubriqueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRubrique() throws Exception {
        int databaseSizeBeforeUpdate = rubriqueRepository.findAll().size();
        rubrique.setId(longCount.incrementAndGet());

        // Create the Rubrique
        RubriqueDTO rubriqueDTO = rubriqueMapper.toDto(rubrique);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRubriqueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(rubriqueDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Rubrique in the database
        List<Rubrique> rubriqueList = rubriqueRepository.findAll();
        assertThat(rubriqueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRubrique() throws Exception {
        int databaseSizeBeforeUpdate = rubriqueRepository.findAll().size();
        rubrique.setId(longCount.incrementAndGet());

        // Create the Rubrique
        RubriqueDTO rubriqueDTO = rubriqueMapper.toDto(rubrique);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRubriqueMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(rubriqueDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Rubrique in the database
        List<Rubrique> rubriqueList = rubriqueRepository.findAll();
        assertThat(rubriqueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRubrique() throws Exception {
        // Initialize the database
        rubriqueRepository.saveAndFlush(rubrique);

        int databaseSizeBeforeDelete = rubriqueRepository.findAll().size();

        // Delete the rubrique
        restRubriqueMockMvc
            .perform(delete(ENTITY_API_URL_ID, rubrique.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Rubrique> rubriqueList = rubriqueRepository.findAll();
        assertThat(rubriqueList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
