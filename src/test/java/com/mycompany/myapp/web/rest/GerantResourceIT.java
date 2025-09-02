package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Gerant;
import com.mycompany.myapp.repository.GerantRepository;
import com.mycompany.myapp.service.dto.GerantDTO;
import com.mycompany.myapp.service.mapper.GerantMapper;
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
 * Integration tests for the {@link GerantResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class GerantResourceIT {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final Instant DEFAULT_DATE_NOMINATION = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_NOMINATION = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_DATE_FIN = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_FIN = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_DATE_HEURE_MODIFICATION = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_HEURE_MODIFICATION = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_DATE_HEURE_CREATION = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_HEURE_CREATION = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Long DEFAULT_UTI_CREE = 1L;
    private static final Long UPDATED_UTI_CREE = 2L;

    private static final Long DEFAULT_UTI_MODIFIE = 1L;
    private static final Long UPDATED_UTI_MODIFIE = 2L;

    private static final String ENTITY_API_URL = "/api/gerants";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private GerantRepository gerantRepository;

    @Autowired
    private GerantMapper gerantMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restGerantMockMvc;

    private Gerant gerant;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Gerant createEntity(EntityManager em) {
        Gerant gerant = new Gerant()
            .nom(DEFAULT_NOM)
            .dateNomination(DEFAULT_DATE_NOMINATION)
            .dateFin(DEFAULT_DATE_FIN)
            .dateHeureModification(DEFAULT_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(DEFAULT_DATE_HEURE_CREATION)
            .utiCree(DEFAULT_UTI_CREE)
            .utiModifie(DEFAULT_UTI_MODIFIE);
        return gerant;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Gerant createUpdatedEntity(EntityManager em) {
        Gerant gerant = new Gerant()
            .nom(UPDATED_NOM)
            .dateNomination(UPDATED_DATE_NOMINATION)
            .dateFin(UPDATED_DATE_FIN)
            .dateHeureModification(UPDATED_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(UPDATED_DATE_HEURE_CREATION)
            .utiCree(UPDATED_UTI_CREE)
            .utiModifie(UPDATED_UTI_MODIFIE);
        return gerant;
    }

    @BeforeEach
    public void initTest() {
        gerant = createEntity(em);
    }

    @Test
    @Transactional
    void createGerant() throws Exception {
        int databaseSizeBeforeCreate = gerantRepository.findAll().size();
        // Create the Gerant
        GerantDTO gerantDTO = gerantMapper.toDto(gerant);
        restGerantMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(gerantDTO)))
            .andExpect(status().isCreated());

        // Validate the Gerant in the database
        List<Gerant> gerantList = gerantRepository.findAll();
        assertThat(gerantList).hasSize(databaseSizeBeforeCreate + 1);
        Gerant testGerant = gerantList.get(gerantList.size() - 1);
        assertThat(testGerant.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testGerant.getDateNomination()).isEqualTo(DEFAULT_DATE_NOMINATION);
        assertThat(testGerant.getDateFin()).isEqualTo(DEFAULT_DATE_FIN);
        assertThat(testGerant.getDateHeureModification()).isEqualTo(DEFAULT_DATE_HEURE_MODIFICATION);
        assertThat(testGerant.getDateHeureCreation()).isEqualTo(DEFAULT_DATE_HEURE_CREATION);
        assertThat(testGerant.getUtiCree()).isEqualTo(DEFAULT_UTI_CREE);
        assertThat(testGerant.getUtiModifie()).isEqualTo(DEFAULT_UTI_MODIFIE);
    }

    @Test
    @Transactional
    void createGerantWithExistingId() throws Exception {
        // Create the Gerant with an existing ID
        gerant.setId(1L);
        GerantDTO gerantDTO = gerantMapper.toDto(gerant);

        int databaseSizeBeforeCreate = gerantRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restGerantMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(gerantDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Gerant in the database
        List<Gerant> gerantList = gerantRepository.findAll();
        assertThat(gerantList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllGerants() throws Exception {
        // Initialize the database
        gerantRepository.saveAndFlush(gerant);

        // Get all the gerantList
        restGerantMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(gerant.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].dateNomination").value(hasItem(DEFAULT_DATE_NOMINATION.toString())))
            .andExpect(jsonPath("$.[*].dateFin").value(hasItem(DEFAULT_DATE_FIN.toString())))
            .andExpect(jsonPath("$.[*].dateHeureModification").value(hasItem(DEFAULT_DATE_HEURE_MODIFICATION.toString())))
            .andExpect(jsonPath("$.[*].dateHeureCreation").value(hasItem(DEFAULT_DATE_HEURE_CREATION.toString())))
            .andExpect(jsonPath("$.[*].utiCree").value(hasItem(DEFAULT_UTI_CREE.intValue())))
            .andExpect(jsonPath("$.[*].utiModifie").value(hasItem(DEFAULT_UTI_MODIFIE.intValue())));
    }

    @Test
    @Transactional
    void getGerant() throws Exception {
        // Initialize the database
        gerantRepository.saveAndFlush(gerant);

        // Get the gerant
        restGerantMockMvc
            .perform(get(ENTITY_API_URL_ID, gerant.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(gerant.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.dateNomination").value(DEFAULT_DATE_NOMINATION.toString()))
            .andExpect(jsonPath("$.dateFin").value(DEFAULT_DATE_FIN.toString()))
            .andExpect(jsonPath("$.dateHeureModification").value(DEFAULT_DATE_HEURE_MODIFICATION.toString()))
            .andExpect(jsonPath("$.dateHeureCreation").value(DEFAULT_DATE_HEURE_CREATION.toString()))
            .andExpect(jsonPath("$.utiCree").value(DEFAULT_UTI_CREE.intValue()))
            .andExpect(jsonPath("$.utiModifie").value(DEFAULT_UTI_MODIFIE.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingGerant() throws Exception {
        // Get the gerant
        restGerantMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingGerant() throws Exception {
        // Initialize the database
        gerantRepository.saveAndFlush(gerant);

        int databaseSizeBeforeUpdate = gerantRepository.findAll().size();

        // Update the gerant
        Gerant updatedGerant = gerantRepository.findById(gerant.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedGerant are not directly saved in db
        em.detach(updatedGerant);
        updatedGerant
            .nom(UPDATED_NOM)
            .dateNomination(UPDATED_DATE_NOMINATION)
            .dateFin(UPDATED_DATE_FIN)
            .dateHeureModification(UPDATED_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(UPDATED_DATE_HEURE_CREATION)
            .utiCree(UPDATED_UTI_CREE)
            .utiModifie(UPDATED_UTI_MODIFIE);
        GerantDTO gerantDTO = gerantMapper.toDto(updatedGerant);

        restGerantMockMvc
            .perform(
                put(ENTITY_API_URL_ID, gerantDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(gerantDTO))
            )
            .andExpect(status().isOk());

        // Validate the Gerant in the database
        List<Gerant> gerantList = gerantRepository.findAll();
        assertThat(gerantList).hasSize(databaseSizeBeforeUpdate);
        Gerant testGerant = gerantList.get(gerantList.size() - 1);
        assertThat(testGerant.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testGerant.getDateNomination()).isEqualTo(UPDATED_DATE_NOMINATION);
        assertThat(testGerant.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
        assertThat(testGerant.getDateHeureModification()).isEqualTo(UPDATED_DATE_HEURE_MODIFICATION);
        assertThat(testGerant.getDateHeureCreation()).isEqualTo(UPDATED_DATE_HEURE_CREATION);
        assertThat(testGerant.getUtiCree()).isEqualTo(UPDATED_UTI_CREE);
        assertThat(testGerant.getUtiModifie()).isEqualTo(UPDATED_UTI_MODIFIE);
    }

    @Test
    @Transactional
    void putNonExistingGerant() throws Exception {
        int databaseSizeBeforeUpdate = gerantRepository.findAll().size();
        gerant.setId(longCount.incrementAndGet());

        // Create the Gerant
        GerantDTO gerantDTO = gerantMapper.toDto(gerant);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGerantMockMvc
            .perform(
                put(ENTITY_API_URL_ID, gerantDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(gerantDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Gerant in the database
        List<Gerant> gerantList = gerantRepository.findAll();
        assertThat(gerantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchGerant() throws Exception {
        int databaseSizeBeforeUpdate = gerantRepository.findAll().size();
        gerant.setId(longCount.incrementAndGet());

        // Create the Gerant
        GerantDTO gerantDTO = gerantMapper.toDto(gerant);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGerantMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(gerantDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Gerant in the database
        List<Gerant> gerantList = gerantRepository.findAll();
        assertThat(gerantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamGerant() throws Exception {
        int databaseSizeBeforeUpdate = gerantRepository.findAll().size();
        gerant.setId(longCount.incrementAndGet());

        // Create the Gerant
        GerantDTO gerantDTO = gerantMapper.toDto(gerant);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGerantMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(gerantDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Gerant in the database
        List<Gerant> gerantList = gerantRepository.findAll();
        assertThat(gerantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateGerantWithPatch() throws Exception {
        // Initialize the database
        gerantRepository.saveAndFlush(gerant);

        int databaseSizeBeforeUpdate = gerantRepository.findAll().size();

        // Update the gerant using partial update
        Gerant partialUpdatedGerant = new Gerant();
        partialUpdatedGerant.setId(gerant.getId());

        partialUpdatedGerant.dateNomination(UPDATED_DATE_NOMINATION).utiCree(UPDATED_UTI_CREE).utiModifie(UPDATED_UTI_MODIFIE);

        restGerantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGerant.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGerant))
            )
            .andExpect(status().isOk());

        // Validate the Gerant in the database
        List<Gerant> gerantList = gerantRepository.findAll();
        assertThat(gerantList).hasSize(databaseSizeBeforeUpdate);
        Gerant testGerant = gerantList.get(gerantList.size() - 1);
        assertThat(testGerant.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testGerant.getDateNomination()).isEqualTo(UPDATED_DATE_NOMINATION);
        assertThat(testGerant.getDateFin()).isEqualTo(DEFAULT_DATE_FIN);
        assertThat(testGerant.getDateHeureModification()).isEqualTo(DEFAULT_DATE_HEURE_MODIFICATION);
        assertThat(testGerant.getDateHeureCreation()).isEqualTo(DEFAULT_DATE_HEURE_CREATION);
        assertThat(testGerant.getUtiCree()).isEqualTo(UPDATED_UTI_CREE);
        assertThat(testGerant.getUtiModifie()).isEqualTo(UPDATED_UTI_MODIFIE);
    }

    @Test
    @Transactional
    void fullUpdateGerantWithPatch() throws Exception {
        // Initialize the database
        gerantRepository.saveAndFlush(gerant);

        int databaseSizeBeforeUpdate = gerantRepository.findAll().size();

        // Update the gerant using partial update
        Gerant partialUpdatedGerant = new Gerant();
        partialUpdatedGerant.setId(gerant.getId());

        partialUpdatedGerant
            .nom(UPDATED_NOM)
            .dateNomination(UPDATED_DATE_NOMINATION)
            .dateFin(UPDATED_DATE_FIN)
            .dateHeureModification(UPDATED_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(UPDATED_DATE_HEURE_CREATION)
            .utiCree(UPDATED_UTI_CREE)
            .utiModifie(UPDATED_UTI_MODIFIE);

        restGerantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGerant.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGerant))
            )
            .andExpect(status().isOk());

        // Validate the Gerant in the database
        List<Gerant> gerantList = gerantRepository.findAll();
        assertThat(gerantList).hasSize(databaseSizeBeforeUpdate);
        Gerant testGerant = gerantList.get(gerantList.size() - 1);
        assertThat(testGerant.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testGerant.getDateNomination()).isEqualTo(UPDATED_DATE_NOMINATION);
        assertThat(testGerant.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
        assertThat(testGerant.getDateHeureModification()).isEqualTo(UPDATED_DATE_HEURE_MODIFICATION);
        assertThat(testGerant.getDateHeureCreation()).isEqualTo(UPDATED_DATE_HEURE_CREATION);
        assertThat(testGerant.getUtiCree()).isEqualTo(UPDATED_UTI_CREE);
        assertThat(testGerant.getUtiModifie()).isEqualTo(UPDATED_UTI_MODIFIE);
    }

    @Test
    @Transactional
    void patchNonExistingGerant() throws Exception {
        int databaseSizeBeforeUpdate = gerantRepository.findAll().size();
        gerant.setId(longCount.incrementAndGet());

        // Create the Gerant
        GerantDTO gerantDTO = gerantMapper.toDto(gerant);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGerantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, gerantDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(gerantDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Gerant in the database
        List<Gerant> gerantList = gerantRepository.findAll();
        assertThat(gerantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchGerant() throws Exception {
        int databaseSizeBeforeUpdate = gerantRepository.findAll().size();
        gerant.setId(longCount.incrementAndGet());

        // Create the Gerant
        GerantDTO gerantDTO = gerantMapper.toDto(gerant);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGerantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(gerantDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Gerant in the database
        List<Gerant> gerantList = gerantRepository.findAll();
        assertThat(gerantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamGerant() throws Exception {
        int databaseSizeBeforeUpdate = gerantRepository.findAll().size();
        gerant.setId(longCount.incrementAndGet());

        // Create the Gerant
        GerantDTO gerantDTO = gerantMapper.toDto(gerant);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGerantMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(gerantDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Gerant in the database
        List<Gerant> gerantList = gerantRepository.findAll();
        assertThat(gerantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteGerant() throws Exception {
        // Initialize the database
        gerantRepository.saveAndFlush(gerant);

        int databaseSizeBeforeDelete = gerantRepository.findAll().size();

        // Delete the gerant
        restGerantMockMvc
            .perform(delete(ENTITY_API_URL_ID, gerant.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Gerant> gerantList = gerantRepository.findAll();
        assertThat(gerantList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
