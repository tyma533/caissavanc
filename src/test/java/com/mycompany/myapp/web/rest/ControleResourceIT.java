package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Controle;
import com.mycompany.myapp.repository.ControleRepository;
import com.mycompany.myapp.service.dto.ControleDTO;
import com.mycompany.myapp.service.mapper.ControleMapper;
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
 * Integration tests for the {@link ControleResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ControleResourceIT {

    private static final Instant DEFAULT_DATE_CONTROLE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_CONTROLE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_OBSERVATION = "AAAAAAAAAA";
    private static final String UPDATED_OBSERVATION = "BBBBBBBBBB";

    private static final Instant DEFAULT_DATE_HEURE_MODIFICATION = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_HEURE_MODIFICATION = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_DATE_HEURE_CREATION = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_HEURE_CREATION = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Long DEFAULT_UTI_CREE = 1L;
    private static final Long UPDATED_UTI_CREE = 2L;

    private static final Long DEFAULT_UTI_MODIFIE = 1L;
    private static final Long UPDATED_UTI_MODIFIE = 2L;

    private static final String ENTITY_API_URL = "/api/controles";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ControleRepository controleRepository;

    @Autowired
    private ControleMapper controleMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restControleMockMvc;

    private Controle controle;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Controle createEntity(EntityManager em) {
        Controle controle = new Controle()
            .dateControle(DEFAULT_DATE_CONTROLE)
            .observation(DEFAULT_OBSERVATION)
            .dateHeureModification(DEFAULT_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(DEFAULT_DATE_HEURE_CREATION)
            .utiCree(DEFAULT_UTI_CREE)
            .utiModifie(DEFAULT_UTI_MODIFIE);
        return controle;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Controle createUpdatedEntity(EntityManager em) {
        Controle controle = new Controle()
            .dateControle(UPDATED_DATE_CONTROLE)
            .observation(UPDATED_OBSERVATION)
            .dateHeureModification(UPDATED_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(UPDATED_DATE_HEURE_CREATION)
            .utiCree(UPDATED_UTI_CREE)
            .utiModifie(UPDATED_UTI_MODIFIE);
        return controle;
    }

    @BeforeEach
    public void initTest() {
        controle = createEntity(em);
    }

    @Test
    @Transactional
    void createControle() throws Exception {
        int databaseSizeBeforeCreate = controleRepository.findAll().size();
        // Create the Controle
        ControleDTO controleDTO = controleMapper.toDto(controle);
        restControleMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(controleDTO)))
            .andExpect(status().isCreated());

        // Validate the Controle in the database
        List<Controle> controleList = controleRepository.findAll();
        assertThat(controleList).hasSize(databaseSizeBeforeCreate + 1);
        Controle testControle = controleList.get(controleList.size() - 1);
        assertThat(testControle.getDateControle()).isEqualTo(DEFAULT_DATE_CONTROLE);
        assertThat(testControle.getObservation()).isEqualTo(DEFAULT_OBSERVATION);
        assertThat(testControle.getDateHeureModification()).isEqualTo(DEFAULT_DATE_HEURE_MODIFICATION);
        assertThat(testControle.getDateHeureCreation()).isEqualTo(DEFAULT_DATE_HEURE_CREATION);
        assertThat(testControle.getUtiCree()).isEqualTo(DEFAULT_UTI_CREE);
        assertThat(testControle.getUtiModifie()).isEqualTo(DEFAULT_UTI_MODIFIE);
    }

    @Test
    @Transactional
    void createControleWithExistingId() throws Exception {
        // Create the Controle with an existing ID
        controle.setId(1L);
        ControleDTO controleDTO = controleMapper.toDto(controle);

        int databaseSizeBeforeCreate = controleRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restControleMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(controleDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Controle in the database
        List<Controle> controleList = controleRepository.findAll();
        assertThat(controleList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllControles() throws Exception {
        // Initialize the database
        controleRepository.saveAndFlush(controle);

        // Get all the controleList
        restControleMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(controle.getId().intValue())))
            .andExpect(jsonPath("$.[*].dateControle").value(hasItem(DEFAULT_DATE_CONTROLE.toString())))
            .andExpect(jsonPath("$.[*].observation").value(hasItem(DEFAULT_OBSERVATION)))
            .andExpect(jsonPath("$.[*].dateHeureModification").value(hasItem(DEFAULT_DATE_HEURE_MODIFICATION.toString())))
            .andExpect(jsonPath("$.[*].dateHeureCreation").value(hasItem(DEFAULT_DATE_HEURE_CREATION.toString())))
            .andExpect(jsonPath("$.[*].utiCree").value(hasItem(DEFAULT_UTI_CREE.intValue())))
            .andExpect(jsonPath("$.[*].utiModifie").value(hasItem(DEFAULT_UTI_MODIFIE.intValue())));
    }

    @Test
    @Transactional
    void getControle() throws Exception {
        // Initialize the database
        controleRepository.saveAndFlush(controle);

        // Get the controle
        restControleMockMvc
            .perform(get(ENTITY_API_URL_ID, controle.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(controle.getId().intValue()))
            .andExpect(jsonPath("$.dateControle").value(DEFAULT_DATE_CONTROLE.toString()))
            .andExpect(jsonPath("$.observation").value(DEFAULT_OBSERVATION))
            .andExpect(jsonPath("$.dateHeureModification").value(DEFAULT_DATE_HEURE_MODIFICATION.toString()))
            .andExpect(jsonPath("$.dateHeureCreation").value(DEFAULT_DATE_HEURE_CREATION.toString()))
            .andExpect(jsonPath("$.utiCree").value(DEFAULT_UTI_CREE.intValue()))
            .andExpect(jsonPath("$.utiModifie").value(DEFAULT_UTI_MODIFIE.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingControle() throws Exception {
        // Get the controle
        restControleMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingControle() throws Exception {
        // Initialize the database
        controleRepository.saveAndFlush(controle);

        int databaseSizeBeforeUpdate = controleRepository.findAll().size();

        // Update the controle
        Controle updatedControle = controleRepository.findById(controle.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedControle are not directly saved in db
        em.detach(updatedControle);
        updatedControle
            .dateControle(UPDATED_DATE_CONTROLE)
            .observation(UPDATED_OBSERVATION)
            .dateHeureModification(UPDATED_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(UPDATED_DATE_HEURE_CREATION)
            .utiCree(UPDATED_UTI_CREE)
            .utiModifie(UPDATED_UTI_MODIFIE);
        ControleDTO controleDTO = controleMapper.toDto(updatedControle);

        restControleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, controleDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(controleDTO))
            )
            .andExpect(status().isOk());

        // Validate the Controle in the database
        List<Controle> controleList = controleRepository.findAll();
        assertThat(controleList).hasSize(databaseSizeBeforeUpdate);
        Controle testControle = controleList.get(controleList.size() - 1);
        assertThat(testControle.getDateControle()).isEqualTo(UPDATED_DATE_CONTROLE);
        assertThat(testControle.getObservation()).isEqualTo(UPDATED_OBSERVATION);
        assertThat(testControle.getDateHeureModification()).isEqualTo(UPDATED_DATE_HEURE_MODIFICATION);
        assertThat(testControle.getDateHeureCreation()).isEqualTo(UPDATED_DATE_HEURE_CREATION);
        assertThat(testControle.getUtiCree()).isEqualTo(UPDATED_UTI_CREE);
        assertThat(testControle.getUtiModifie()).isEqualTo(UPDATED_UTI_MODIFIE);
    }

    @Test
    @Transactional
    void putNonExistingControle() throws Exception {
        int databaseSizeBeforeUpdate = controleRepository.findAll().size();
        controle.setId(longCount.incrementAndGet());

        // Create the Controle
        ControleDTO controleDTO = controleMapper.toDto(controle);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restControleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, controleDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(controleDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Controle in the database
        List<Controle> controleList = controleRepository.findAll();
        assertThat(controleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchControle() throws Exception {
        int databaseSizeBeforeUpdate = controleRepository.findAll().size();
        controle.setId(longCount.incrementAndGet());

        // Create the Controle
        ControleDTO controleDTO = controleMapper.toDto(controle);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restControleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(controleDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Controle in the database
        List<Controle> controleList = controleRepository.findAll();
        assertThat(controleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamControle() throws Exception {
        int databaseSizeBeforeUpdate = controleRepository.findAll().size();
        controle.setId(longCount.incrementAndGet());

        // Create the Controle
        ControleDTO controleDTO = controleMapper.toDto(controle);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restControleMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(controleDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Controle in the database
        List<Controle> controleList = controleRepository.findAll();
        assertThat(controleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateControleWithPatch() throws Exception {
        // Initialize the database
        controleRepository.saveAndFlush(controle);

        int databaseSizeBeforeUpdate = controleRepository.findAll().size();

        // Update the controle using partial update
        Controle partialUpdatedControle = new Controle();
        partialUpdatedControle.setId(controle.getId());

        partialUpdatedControle.dateControle(UPDATED_DATE_CONTROLE).observation(UPDATED_OBSERVATION);

        restControleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedControle.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedControle))
            )
            .andExpect(status().isOk());

        // Validate the Controle in the database
        List<Controle> controleList = controleRepository.findAll();
        assertThat(controleList).hasSize(databaseSizeBeforeUpdate);
        Controle testControle = controleList.get(controleList.size() - 1);
        assertThat(testControle.getDateControle()).isEqualTo(UPDATED_DATE_CONTROLE);
        assertThat(testControle.getObservation()).isEqualTo(UPDATED_OBSERVATION);
        assertThat(testControle.getDateHeureModification()).isEqualTo(DEFAULT_DATE_HEURE_MODIFICATION);
        assertThat(testControle.getDateHeureCreation()).isEqualTo(DEFAULT_DATE_HEURE_CREATION);
        assertThat(testControle.getUtiCree()).isEqualTo(DEFAULT_UTI_CREE);
        assertThat(testControle.getUtiModifie()).isEqualTo(DEFAULT_UTI_MODIFIE);
    }

    @Test
    @Transactional
    void fullUpdateControleWithPatch() throws Exception {
        // Initialize the database
        controleRepository.saveAndFlush(controle);

        int databaseSizeBeforeUpdate = controleRepository.findAll().size();

        // Update the controle using partial update
        Controle partialUpdatedControle = new Controle();
        partialUpdatedControle.setId(controle.getId());

        partialUpdatedControle
            .dateControle(UPDATED_DATE_CONTROLE)
            .observation(UPDATED_OBSERVATION)
            .dateHeureModification(UPDATED_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(UPDATED_DATE_HEURE_CREATION)
            .utiCree(UPDATED_UTI_CREE)
            .utiModifie(UPDATED_UTI_MODIFIE);

        restControleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedControle.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedControle))
            )
            .andExpect(status().isOk());

        // Validate the Controle in the database
        List<Controle> controleList = controleRepository.findAll();
        assertThat(controleList).hasSize(databaseSizeBeforeUpdate);
        Controle testControle = controleList.get(controleList.size() - 1);
        assertThat(testControle.getDateControle()).isEqualTo(UPDATED_DATE_CONTROLE);
        assertThat(testControle.getObservation()).isEqualTo(UPDATED_OBSERVATION);
        assertThat(testControle.getDateHeureModification()).isEqualTo(UPDATED_DATE_HEURE_MODIFICATION);
        assertThat(testControle.getDateHeureCreation()).isEqualTo(UPDATED_DATE_HEURE_CREATION);
        assertThat(testControle.getUtiCree()).isEqualTo(UPDATED_UTI_CREE);
        assertThat(testControle.getUtiModifie()).isEqualTo(UPDATED_UTI_MODIFIE);
    }

    @Test
    @Transactional
    void patchNonExistingControle() throws Exception {
        int databaseSizeBeforeUpdate = controleRepository.findAll().size();
        controle.setId(longCount.incrementAndGet());

        // Create the Controle
        ControleDTO controleDTO = controleMapper.toDto(controle);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restControleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, controleDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(controleDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Controle in the database
        List<Controle> controleList = controleRepository.findAll();
        assertThat(controleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchControle() throws Exception {
        int databaseSizeBeforeUpdate = controleRepository.findAll().size();
        controle.setId(longCount.incrementAndGet());

        // Create the Controle
        ControleDTO controleDTO = controleMapper.toDto(controle);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restControleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(controleDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Controle in the database
        List<Controle> controleList = controleRepository.findAll();
        assertThat(controleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamControle() throws Exception {
        int databaseSizeBeforeUpdate = controleRepository.findAll().size();
        controle.setId(longCount.incrementAndGet());

        // Create the Controle
        ControleDTO controleDTO = controleMapper.toDto(controle);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restControleMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(controleDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Controle in the database
        List<Controle> controleList = controleRepository.findAll();
        assertThat(controleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteControle() throws Exception {
        // Initialize the database
        controleRepository.saveAndFlush(controle);

        int databaseSizeBeforeDelete = controleRepository.findAll().size();

        // Delete the controle
        restControleMockMvc
            .perform(delete(ENTITY_API_URL_ID, controle.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Controle> controleList = controleRepository.findAll();
        assertThat(controleList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
