package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.GerantCaisse;
import com.mycompany.myapp.repository.GerantCaisseRepository;
import com.mycompany.myapp.service.dto.GerantCaisseDTO;
import com.mycompany.myapp.service.mapper.GerantCaisseMapper;
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
 * Integration tests for the {@link GerantCaisseResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class GerantCaisseResourceIT {

    private static final Boolean DEFAULT_ACTIF = false;
    private static final Boolean UPDATED_ACTIF = true;

    private static final Instant DEFAULT_DATE_HEURE_MODIFICATION = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_HEURE_MODIFICATION = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_DATE_HEURE_CREATION = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_HEURE_CREATION = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Long DEFAULT_UTI_CREE = 1L;
    private static final Long UPDATED_UTI_CREE = 2L;

    private static final Long DEFAULT_UTI_MODIFIE = 1L;
    private static final Long UPDATED_UTI_MODIFIE = 2L;

    private static final String ENTITY_API_URL = "/api/gerant-caisses";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private GerantCaisseRepository gerantCaisseRepository;

    @Autowired
    private GerantCaisseMapper gerantCaisseMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restGerantCaisseMockMvc;

    private GerantCaisse gerantCaisse;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GerantCaisse createEntity(EntityManager em) {
        GerantCaisse gerantCaisse = new GerantCaisse()
            .actif(DEFAULT_ACTIF)
            .dateHeureModification(DEFAULT_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(DEFAULT_DATE_HEURE_CREATION)
            .utiCree(DEFAULT_UTI_CREE)
            .utiModifie(DEFAULT_UTI_MODIFIE);
        return gerantCaisse;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GerantCaisse createUpdatedEntity(EntityManager em) {
        GerantCaisse gerantCaisse = new GerantCaisse()
            .actif(UPDATED_ACTIF)
            .dateHeureModification(UPDATED_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(UPDATED_DATE_HEURE_CREATION)
            .utiCree(UPDATED_UTI_CREE)
            .utiModifie(UPDATED_UTI_MODIFIE);
        return gerantCaisse;
    }

    @BeforeEach
    public void initTest() {
        gerantCaisse = createEntity(em);
    }

    @Test
    @Transactional
    void createGerantCaisse() throws Exception {
        int databaseSizeBeforeCreate = gerantCaisseRepository.findAll().size();
        // Create the GerantCaisse
        GerantCaisseDTO gerantCaisseDTO = gerantCaisseMapper.toDto(gerantCaisse);
        restGerantCaisseMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(gerantCaisseDTO))
            )
            .andExpect(status().isCreated());

        // Validate the GerantCaisse in the database
        List<GerantCaisse> gerantCaisseList = gerantCaisseRepository.findAll();
        assertThat(gerantCaisseList).hasSize(databaseSizeBeforeCreate + 1);
        GerantCaisse testGerantCaisse = gerantCaisseList.get(gerantCaisseList.size() - 1);
        assertThat(testGerantCaisse.getActif()).isEqualTo(DEFAULT_ACTIF);
        assertThat(testGerantCaisse.getDateHeureModification()).isEqualTo(DEFAULT_DATE_HEURE_MODIFICATION);
        assertThat(testGerantCaisse.getDateHeureCreation()).isEqualTo(DEFAULT_DATE_HEURE_CREATION);
        assertThat(testGerantCaisse.getUtiCree()).isEqualTo(DEFAULT_UTI_CREE);
        assertThat(testGerantCaisse.getUtiModifie()).isEqualTo(DEFAULT_UTI_MODIFIE);
    }

    @Test
    @Transactional
    void createGerantCaisseWithExistingId() throws Exception {
        // Create the GerantCaisse with an existing ID
        gerantCaisse.setId(1L);
        GerantCaisseDTO gerantCaisseDTO = gerantCaisseMapper.toDto(gerantCaisse);

        int databaseSizeBeforeCreate = gerantCaisseRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restGerantCaisseMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(gerantCaisseDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the GerantCaisse in the database
        List<GerantCaisse> gerantCaisseList = gerantCaisseRepository.findAll();
        assertThat(gerantCaisseList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllGerantCaisses() throws Exception {
        // Initialize the database
        gerantCaisseRepository.saveAndFlush(gerantCaisse);

        // Get all the gerantCaisseList
        restGerantCaisseMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(gerantCaisse.getId().intValue())))
            .andExpect(jsonPath("$.[*].actif").value(hasItem(DEFAULT_ACTIF.booleanValue())))
            .andExpect(jsonPath("$.[*].dateHeureModification").value(hasItem(DEFAULT_DATE_HEURE_MODIFICATION.toString())))
            .andExpect(jsonPath("$.[*].dateHeureCreation").value(hasItem(DEFAULT_DATE_HEURE_CREATION.toString())))
            .andExpect(jsonPath("$.[*].utiCree").value(hasItem(DEFAULT_UTI_CREE.intValue())))
            .andExpect(jsonPath("$.[*].utiModifie").value(hasItem(DEFAULT_UTI_MODIFIE.intValue())));
    }

    @Test
    @Transactional
    void getGerantCaisse() throws Exception {
        // Initialize the database
        gerantCaisseRepository.saveAndFlush(gerantCaisse);

        // Get the gerantCaisse
        restGerantCaisseMockMvc
            .perform(get(ENTITY_API_URL_ID, gerantCaisse.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(gerantCaisse.getId().intValue()))
            .andExpect(jsonPath("$.actif").value(DEFAULT_ACTIF.booleanValue()))
            .andExpect(jsonPath("$.dateHeureModification").value(DEFAULT_DATE_HEURE_MODIFICATION.toString()))
            .andExpect(jsonPath("$.dateHeureCreation").value(DEFAULT_DATE_HEURE_CREATION.toString()))
            .andExpect(jsonPath("$.utiCree").value(DEFAULT_UTI_CREE.intValue()))
            .andExpect(jsonPath("$.utiModifie").value(DEFAULT_UTI_MODIFIE.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingGerantCaisse() throws Exception {
        // Get the gerantCaisse
        restGerantCaisseMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingGerantCaisse() throws Exception {
        // Initialize the database
        gerantCaisseRepository.saveAndFlush(gerantCaisse);

        int databaseSizeBeforeUpdate = gerantCaisseRepository.findAll().size();

        // Update the gerantCaisse
        GerantCaisse updatedGerantCaisse = gerantCaisseRepository.findById(gerantCaisse.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedGerantCaisse are not directly saved in db
        em.detach(updatedGerantCaisse);
        updatedGerantCaisse
            .actif(UPDATED_ACTIF)
            .dateHeureModification(UPDATED_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(UPDATED_DATE_HEURE_CREATION)
            .utiCree(UPDATED_UTI_CREE)
            .utiModifie(UPDATED_UTI_MODIFIE);
        GerantCaisseDTO gerantCaisseDTO = gerantCaisseMapper.toDto(updatedGerantCaisse);

        restGerantCaisseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, gerantCaisseDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(gerantCaisseDTO))
            )
            .andExpect(status().isOk());

        // Validate the GerantCaisse in the database
        List<GerantCaisse> gerantCaisseList = gerantCaisseRepository.findAll();
        assertThat(gerantCaisseList).hasSize(databaseSizeBeforeUpdate);
        GerantCaisse testGerantCaisse = gerantCaisseList.get(gerantCaisseList.size() - 1);
        assertThat(testGerantCaisse.getActif()).isEqualTo(UPDATED_ACTIF);
        assertThat(testGerantCaisse.getDateHeureModification()).isEqualTo(UPDATED_DATE_HEURE_MODIFICATION);
        assertThat(testGerantCaisse.getDateHeureCreation()).isEqualTo(UPDATED_DATE_HEURE_CREATION);
        assertThat(testGerantCaisse.getUtiCree()).isEqualTo(UPDATED_UTI_CREE);
        assertThat(testGerantCaisse.getUtiModifie()).isEqualTo(UPDATED_UTI_MODIFIE);
    }

    @Test
    @Transactional
    void putNonExistingGerantCaisse() throws Exception {
        int databaseSizeBeforeUpdate = gerantCaisseRepository.findAll().size();
        gerantCaisse.setId(longCount.incrementAndGet());

        // Create the GerantCaisse
        GerantCaisseDTO gerantCaisseDTO = gerantCaisseMapper.toDto(gerantCaisse);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGerantCaisseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, gerantCaisseDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(gerantCaisseDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the GerantCaisse in the database
        List<GerantCaisse> gerantCaisseList = gerantCaisseRepository.findAll();
        assertThat(gerantCaisseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchGerantCaisse() throws Exception {
        int databaseSizeBeforeUpdate = gerantCaisseRepository.findAll().size();
        gerantCaisse.setId(longCount.incrementAndGet());

        // Create the GerantCaisse
        GerantCaisseDTO gerantCaisseDTO = gerantCaisseMapper.toDto(gerantCaisse);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGerantCaisseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(gerantCaisseDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the GerantCaisse in the database
        List<GerantCaisse> gerantCaisseList = gerantCaisseRepository.findAll();
        assertThat(gerantCaisseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamGerantCaisse() throws Exception {
        int databaseSizeBeforeUpdate = gerantCaisseRepository.findAll().size();
        gerantCaisse.setId(longCount.incrementAndGet());

        // Create the GerantCaisse
        GerantCaisseDTO gerantCaisseDTO = gerantCaisseMapper.toDto(gerantCaisse);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGerantCaisseMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(gerantCaisseDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the GerantCaisse in the database
        List<GerantCaisse> gerantCaisseList = gerantCaisseRepository.findAll();
        assertThat(gerantCaisseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateGerantCaisseWithPatch() throws Exception {
        // Initialize the database
        gerantCaisseRepository.saveAndFlush(gerantCaisse);

        int databaseSizeBeforeUpdate = gerantCaisseRepository.findAll().size();

        // Update the gerantCaisse using partial update
        GerantCaisse partialUpdatedGerantCaisse = new GerantCaisse();
        partialUpdatedGerantCaisse.setId(gerantCaisse.getId());

        partialUpdatedGerantCaisse.actif(UPDATED_ACTIF).dateHeureCreation(UPDATED_DATE_HEURE_CREATION);

        restGerantCaisseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGerantCaisse.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGerantCaisse))
            )
            .andExpect(status().isOk());

        // Validate the GerantCaisse in the database
        List<GerantCaisse> gerantCaisseList = gerantCaisseRepository.findAll();
        assertThat(gerantCaisseList).hasSize(databaseSizeBeforeUpdate);
        GerantCaisse testGerantCaisse = gerantCaisseList.get(gerantCaisseList.size() - 1);
        assertThat(testGerantCaisse.getActif()).isEqualTo(UPDATED_ACTIF);
        assertThat(testGerantCaisse.getDateHeureModification()).isEqualTo(DEFAULT_DATE_HEURE_MODIFICATION);
        assertThat(testGerantCaisse.getDateHeureCreation()).isEqualTo(UPDATED_DATE_HEURE_CREATION);
        assertThat(testGerantCaisse.getUtiCree()).isEqualTo(DEFAULT_UTI_CREE);
        assertThat(testGerantCaisse.getUtiModifie()).isEqualTo(DEFAULT_UTI_MODIFIE);
    }

    @Test
    @Transactional
    void fullUpdateGerantCaisseWithPatch() throws Exception {
        // Initialize the database
        gerantCaisseRepository.saveAndFlush(gerantCaisse);

        int databaseSizeBeforeUpdate = gerantCaisseRepository.findAll().size();

        // Update the gerantCaisse using partial update
        GerantCaisse partialUpdatedGerantCaisse = new GerantCaisse();
        partialUpdatedGerantCaisse.setId(gerantCaisse.getId());

        partialUpdatedGerantCaisse
            .actif(UPDATED_ACTIF)
            .dateHeureModification(UPDATED_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(UPDATED_DATE_HEURE_CREATION)
            .utiCree(UPDATED_UTI_CREE)
            .utiModifie(UPDATED_UTI_MODIFIE);

        restGerantCaisseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGerantCaisse.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGerantCaisse))
            )
            .andExpect(status().isOk());

        // Validate the GerantCaisse in the database
        List<GerantCaisse> gerantCaisseList = gerantCaisseRepository.findAll();
        assertThat(gerantCaisseList).hasSize(databaseSizeBeforeUpdate);
        GerantCaisse testGerantCaisse = gerantCaisseList.get(gerantCaisseList.size() - 1);
        assertThat(testGerantCaisse.getActif()).isEqualTo(UPDATED_ACTIF);
        assertThat(testGerantCaisse.getDateHeureModification()).isEqualTo(UPDATED_DATE_HEURE_MODIFICATION);
        assertThat(testGerantCaisse.getDateHeureCreation()).isEqualTo(UPDATED_DATE_HEURE_CREATION);
        assertThat(testGerantCaisse.getUtiCree()).isEqualTo(UPDATED_UTI_CREE);
        assertThat(testGerantCaisse.getUtiModifie()).isEqualTo(UPDATED_UTI_MODIFIE);
    }

    @Test
    @Transactional
    void patchNonExistingGerantCaisse() throws Exception {
        int databaseSizeBeforeUpdate = gerantCaisseRepository.findAll().size();
        gerantCaisse.setId(longCount.incrementAndGet());

        // Create the GerantCaisse
        GerantCaisseDTO gerantCaisseDTO = gerantCaisseMapper.toDto(gerantCaisse);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGerantCaisseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, gerantCaisseDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(gerantCaisseDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the GerantCaisse in the database
        List<GerantCaisse> gerantCaisseList = gerantCaisseRepository.findAll();
        assertThat(gerantCaisseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchGerantCaisse() throws Exception {
        int databaseSizeBeforeUpdate = gerantCaisseRepository.findAll().size();
        gerantCaisse.setId(longCount.incrementAndGet());

        // Create the GerantCaisse
        GerantCaisseDTO gerantCaisseDTO = gerantCaisseMapper.toDto(gerantCaisse);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGerantCaisseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(gerantCaisseDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the GerantCaisse in the database
        List<GerantCaisse> gerantCaisseList = gerantCaisseRepository.findAll();
        assertThat(gerantCaisseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamGerantCaisse() throws Exception {
        int databaseSizeBeforeUpdate = gerantCaisseRepository.findAll().size();
        gerantCaisse.setId(longCount.incrementAndGet());

        // Create the GerantCaisse
        GerantCaisseDTO gerantCaisseDTO = gerantCaisseMapper.toDto(gerantCaisse);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGerantCaisseMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(gerantCaisseDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the GerantCaisse in the database
        List<GerantCaisse> gerantCaisseList = gerantCaisseRepository.findAll();
        assertThat(gerantCaisseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteGerantCaisse() throws Exception {
        // Initialize the database
        gerantCaisseRepository.saveAndFlush(gerantCaisse);

        int databaseSizeBeforeDelete = gerantCaisseRepository.findAll().size();

        // Delete the gerantCaisse
        restGerantCaisseMockMvc
            .perform(delete(ENTITY_API_URL_ID, gerantCaisse.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<GerantCaisse> gerantCaisseList = gerantCaisseRepository.findAll();
        assertThat(gerantCaisseList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
