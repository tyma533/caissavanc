package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.AgentEtatProfil;
import com.mycompany.myapp.repository.AgentEtatProfilRepository;
import com.mycompany.myapp.service.dto.AgentEtatProfilDTO;
import com.mycompany.myapp.service.mapper.AgentEtatProfilMapper;
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
 * Integration tests for the {@link AgentEtatProfilResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AgentEtatProfilResourceIT {

    private static final String DEFAULT_PROFIL = "AAAAAAAAAA";
    private static final String UPDATED_PROFIL = "BBBBBBBBBB";

    private static final Boolean DEFAULT_ACTIF = false;
    private static final Boolean UPDATED_ACTIF = true;

    private static final Instant DEFAULT_DATE_HEURE_MODIFICATION = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_HEURE_MODIFICATION = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_DATE_HEURE_CREATION = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_HEURE_CREATION = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_MODIFIED_BY = "AAAAAAAAAA";
    private static final String UPDATED_MODIFIED_BY = "BBBBBBBBBB";

    private static final String DEFAULT_CREATED_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATED_BY = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/agent-etat-profils";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AgentEtatProfilRepository agentEtatProfilRepository;

    @Autowired
    private AgentEtatProfilMapper agentEtatProfilMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAgentEtatProfilMockMvc;

    private AgentEtatProfil agentEtatProfil;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AgentEtatProfil createEntity(EntityManager em) {
        AgentEtatProfil agentEtatProfil = new AgentEtatProfil()
            .profil(DEFAULT_PROFIL)
            .actif(DEFAULT_ACTIF)
            .dateHeureModification(DEFAULT_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(DEFAULT_DATE_HEURE_CREATION)
            .modifiedBy(DEFAULT_MODIFIED_BY)
            .createdBy(DEFAULT_CREATED_BY);
        return agentEtatProfil;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AgentEtatProfil createUpdatedEntity(EntityManager em) {
        AgentEtatProfil agentEtatProfil = new AgentEtatProfil()
            .profil(UPDATED_PROFIL)
            .actif(UPDATED_ACTIF)
            .dateHeureModification(UPDATED_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(UPDATED_DATE_HEURE_CREATION)
            .modifiedBy(UPDATED_MODIFIED_BY)
            .createdBy(UPDATED_CREATED_BY);
        return agentEtatProfil;
    }

    @BeforeEach
    public void initTest() {
        agentEtatProfil = createEntity(em);
    }

    @Test
    @Transactional
    void createAgentEtatProfil() throws Exception {
        int databaseSizeBeforeCreate = agentEtatProfilRepository.findAll().size();
        // Create the AgentEtatProfil
        AgentEtatProfilDTO agentEtatProfilDTO = agentEtatProfilMapper.toDto(agentEtatProfil);
        restAgentEtatProfilMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(agentEtatProfilDTO))
            )
            .andExpect(status().isCreated());

        // Validate the AgentEtatProfil in the database
        List<AgentEtatProfil> agentEtatProfilList = agentEtatProfilRepository.findAll();
        assertThat(agentEtatProfilList).hasSize(databaseSizeBeforeCreate + 1);
        AgentEtatProfil testAgentEtatProfil = agentEtatProfilList.get(agentEtatProfilList.size() - 1);
        assertThat(testAgentEtatProfil.getProfil()).isEqualTo(DEFAULT_PROFIL);
        assertThat(testAgentEtatProfil.getActif()).isEqualTo(DEFAULT_ACTIF);
        assertThat(testAgentEtatProfil.getDateHeureModification()).isEqualTo(DEFAULT_DATE_HEURE_MODIFICATION);
        assertThat(testAgentEtatProfil.getDateHeureCreation()).isEqualTo(DEFAULT_DATE_HEURE_CREATION);
        assertThat(testAgentEtatProfil.getModifiedBy()).isEqualTo(DEFAULT_MODIFIED_BY);
        assertThat(testAgentEtatProfil.getCreatedBy()).isEqualTo(DEFAULT_CREATED_BY);
    }

    @Test
    @Transactional
    void createAgentEtatProfilWithExistingId() throws Exception {
        // Create the AgentEtatProfil with an existing ID
        agentEtatProfil.setId(1L);
        AgentEtatProfilDTO agentEtatProfilDTO = agentEtatProfilMapper.toDto(agentEtatProfil);

        int databaseSizeBeforeCreate = agentEtatProfilRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAgentEtatProfilMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(agentEtatProfilDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the AgentEtatProfil in the database
        List<AgentEtatProfil> agentEtatProfilList = agentEtatProfilRepository.findAll();
        assertThat(agentEtatProfilList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAgentEtatProfils() throws Exception {
        // Initialize the database
        agentEtatProfilRepository.saveAndFlush(agentEtatProfil);

        // Get all the agentEtatProfilList
        restAgentEtatProfilMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(agentEtatProfil.getId().intValue())))
            .andExpect(jsonPath("$.[*].profil").value(hasItem(DEFAULT_PROFIL)))
            .andExpect(jsonPath("$.[*].actif").value(hasItem(DEFAULT_ACTIF.booleanValue())))
            .andExpect(jsonPath("$.[*].dateHeureModification").value(hasItem(DEFAULT_DATE_HEURE_MODIFICATION.toString())))
            .andExpect(jsonPath("$.[*].dateHeureCreation").value(hasItem(DEFAULT_DATE_HEURE_CREATION.toString())))
            .andExpect(jsonPath("$.[*].modifiedBy").value(hasItem(DEFAULT_MODIFIED_BY)))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)));
    }

    @Test
    @Transactional
    void getAgentEtatProfil() throws Exception {
        // Initialize the database
        agentEtatProfilRepository.saveAndFlush(agentEtatProfil);

        // Get the agentEtatProfil
        restAgentEtatProfilMockMvc
            .perform(get(ENTITY_API_URL_ID, agentEtatProfil.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(agentEtatProfil.getId().intValue()))
            .andExpect(jsonPath("$.profil").value(DEFAULT_PROFIL))
            .andExpect(jsonPath("$.actif").value(DEFAULT_ACTIF.booleanValue()))
            .andExpect(jsonPath("$.dateHeureModification").value(DEFAULT_DATE_HEURE_MODIFICATION.toString()))
            .andExpect(jsonPath("$.dateHeureCreation").value(DEFAULT_DATE_HEURE_CREATION.toString()))
            .andExpect(jsonPath("$.modifiedBy").value(DEFAULT_MODIFIED_BY))
            .andExpect(jsonPath("$.createdBy").value(DEFAULT_CREATED_BY));
    }

    @Test
    @Transactional
    void getNonExistingAgentEtatProfil() throws Exception {
        // Get the agentEtatProfil
        restAgentEtatProfilMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAgentEtatProfil() throws Exception {
        // Initialize the database
        agentEtatProfilRepository.saveAndFlush(agentEtatProfil);

        int databaseSizeBeforeUpdate = agentEtatProfilRepository.findAll().size();

        // Update the agentEtatProfil
        AgentEtatProfil updatedAgentEtatProfil = agentEtatProfilRepository.findById(agentEtatProfil.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedAgentEtatProfil are not directly saved in db
        em.detach(updatedAgentEtatProfil);
        updatedAgentEtatProfil
            .profil(UPDATED_PROFIL)
            .actif(UPDATED_ACTIF)
            .dateHeureModification(UPDATED_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(UPDATED_DATE_HEURE_CREATION)
            .modifiedBy(UPDATED_MODIFIED_BY)
            .createdBy(UPDATED_CREATED_BY);
        AgentEtatProfilDTO agentEtatProfilDTO = agentEtatProfilMapper.toDto(updatedAgentEtatProfil);

        restAgentEtatProfilMockMvc
            .perform(
                put(ENTITY_API_URL_ID, agentEtatProfilDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(agentEtatProfilDTO))
            )
            .andExpect(status().isOk());

        // Validate the AgentEtatProfil in the database
        List<AgentEtatProfil> agentEtatProfilList = agentEtatProfilRepository.findAll();
        assertThat(agentEtatProfilList).hasSize(databaseSizeBeforeUpdate);
        AgentEtatProfil testAgentEtatProfil = agentEtatProfilList.get(agentEtatProfilList.size() - 1);
        assertThat(testAgentEtatProfil.getProfil()).isEqualTo(UPDATED_PROFIL);
        assertThat(testAgentEtatProfil.getActif()).isEqualTo(UPDATED_ACTIF);
        assertThat(testAgentEtatProfil.getDateHeureModification()).isEqualTo(UPDATED_DATE_HEURE_MODIFICATION);
        assertThat(testAgentEtatProfil.getDateHeureCreation()).isEqualTo(UPDATED_DATE_HEURE_CREATION);
        assertThat(testAgentEtatProfil.getModifiedBy()).isEqualTo(UPDATED_MODIFIED_BY);
        assertThat(testAgentEtatProfil.getCreatedBy()).isEqualTo(UPDATED_CREATED_BY);
    }

    @Test
    @Transactional
    void putNonExistingAgentEtatProfil() throws Exception {
        int databaseSizeBeforeUpdate = agentEtatProfilRepository.findAll().size();
        agentEtatProfil.setId(longCount.incrementAndGet());

        // Create the AgentEtatProfil
        AgentEtatProfilDTO agentEtatProfilDTO = agentEtatProfilMapper.toDto(agentEtatProfil);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAgentEtatProfilMockMvc
            .perform(
                put(ENTITY_API_URL_ID, agentEtatProfilDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(agentEtatProfilDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the AgentEtatProfil in the database
        List<AgentEtatProfil> agentEtatProfilList = agentEtatProfilRepository.findAll();
        assertThat(agentEtatProfilList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAgentEtatProfil() throws Exception {
        int databaseSizeBeforeUpdate = agentEtatProfilRepository.findAll().size();
        agentEtatProfil.setId(longCount.incrementAndGet());

        // Create the AgentEtatProfil
        AgentEtatProfilDTO agentEtatProfilDTO = agentEtatProfilMapper.toDto(agentEtatProfil);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAgentEtatProfilMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(agentEtatProfilDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the AgentEtatProfil in the database
        List<AgentEtatProfil> agentEtatProfilList = agentEtatProfilRepository.findAll();
        assertThat(agentEtatProfilList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAgentEtatProfil() throws Exception {
        int databaseSizeBeforeUpdate = agentEtatProfilRepository.findAll().size();
        agentEtatProfil.setId(longCount.incrementAndGet());

        // Create the AgentEtatProfil
        AgentEtatProfilDTO agentEtatProfilDTO = agentEtatProfilMapper.toDto(agentEtatProfil);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAgentEtatProfilMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(agentEtatProfilDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AgentEtatProfil in the database
        List<AgentEtatProfil> agentEtatProfilList = agentEtatProfilRepository.findAll();
        assertThat(agentEtatProfilList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAgentEtatProfilWithPatch() throws Exception {
        // Initialize the database
        agentEtatProfilRepository.saveAndFlush(agentEtatProfil);

        int databaseSizeBeforeUpdate = agentEtatProfilRepository.findAll().size();

        // Update the agentEtatProfil using partial update
        AgentEtatProfil partialUpdatedAgentEtatProfil = new AgentEtatProfil();
        partialUpdatedAgentEtatProfil.setId(agentEtatProfil.getId());

        partialUpdatedAgentEtatProfil
            .profil(UPDATED_PROFIL)
            .dateHeureModification(UPDATED_DATE_HEURE_MODIFICATION)
            .modifiedBy(UPDATED_MODIFIED_BY);

        restAgentEtatProfilMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAgentEtatProfil.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAgentEtatProfil))
            )
            .andExpect(status().isOk());

        // Validate the AgentEtatProfil in the database
        List<AgentEtatProfil> agentEtatProfilList = agentEtatProfilRepository.findAll();
        assertThat(agentEtatProfilList).hasSize(databaseSizeBeforeUpdate);
        AgentEtatProfil testAgentEtatProfil = agentEtatProfilList.get(agentEtatProfilList.size() - 1);
        assertThat(testAgentEtatProfil.getProfil()).isEqualTo(UPDATED_PROFIL);
        assertThat(testAgentEtatProfil.getActif()).isEqualTo(DEFAULT_ACTIF);
        assertThat(testAgentEtatProfil.getDateHeureModification()).isEqualTo(UPDATED_DATE_HEURE_MODIFICATION);
        assertThat(testAgentEtatProfil.getDateHeureCreation()).isEqualTo(DEFAULT_DATE_HEURE_CREATION);
        assertThat(testAgentEtatProfil.getModifiedBy()).isEqualTo(UPDATED_MODIFIED_BY);
        assertThat(testAgentEtatProfil.getCreatedBy()).isEqualTo(DEFAULT_CREATED_BY);
    }

    @Test
    @Transactional
    void fullUpdateAgentEtatProfilWithPatch() throws Exception {
        // Initialize the database
        agentEtatProfilRepository.saveAndFlush(agentEtatProfil);

        int databaseSizeBeforeUpdate = agentEtatProfilRepository.findAll().size();

        // Update the agentEtatProfil using partial update
        AgentEtatProfil partialUpdatedAgentEtatProfil = new AgentEtatProfil();
        partialUpdatedAgentEtatProfil.setId(agentEtatProfil.getId());

        partialUpdatedAgentEtatProfil
            .profil(UPDATED_PROFIL)
            .actif(UPDATED_ACTIF)
            .dateHeureModification(UPDATED_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(UPDATED_DATE_HEURE_CREATION)
            .modifiedBy(UPDATED_MODIFIED_BY)
            .createdBy(UPDATED_CREATED_BY);

        restAgentEtatProfilMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAgentEtatProfil.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAgentEtatProfil))
            )
            .andExpect(status().isOk());

        // Validate the AgentEtatProfil in the database
        List<AgentEtatProfil> agentEtatProfilList = agentEtatProfilRepository.findAll();
        assertThat(agentEtatProfilList).hasSize(databaseSizeBeforeUpdate);
        AgentEtatProfil testAgentEtatProfil = agentEtatProfilList.get(agentEtatProfilList.size() - 1);
        assertThat(testAgentEtatProfil.getProfil()).isEqualTo(UPDATED_PROFIL);
        assertThat(testAgentEtatProfil.getActif()).isEqualTo(UPDATED_ACTIF);
        assertThat(testAgentEtatProfil.getDateHeureModification()).isEqualTo(UPDATED_DATE_HEURE_MODIFICATION);
        assertThat(testAgentEtatProfil.getDateHeureCreation()).isEqualTo(UPDATED_DATE_HEURE_CREATION);
        assertThat(testAgentEtatProfil.getModifiedBy()).isEqualTo(UPDATED_MODIFIED_BY);
        assertThat(testAgentEtatProfil.getCreatedBy()).isEqualTo(UPDATED_CREATED_BY);
    }

    @Test
    @Transactional
    void patchNonExistingAgentEtatProfil() throws Exception {
        int databaseSizeBeforeUpdate = agentEtatProfilRepository.findAll().size();
        agentEtatProfil.setId(longCount.incrementAndGet());

        // Create the AgentEtatProfil
        AgentEtatProfilDTO agentEtatProfilDTO = agentEtatProfilMapper.toDto(agentEtatProfil);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAgentEtatProfilMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, agentEtatProfilDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(agentEtatProfilDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the AgentEtatProfil in the database
        List<AgentEtatProfil> agentEtatProfilList = agentEtatProfilRepository.findAll();
        assertThat(agentEtatProfilList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAgentEtatProfil() throws Exception {
        int databaseSizeBeforeUpdate = agentEtatProfilRepository.findAll().size();
        agentEtatProfil.setId(longCount.incrementAndGet());

        // Create the AgentEtatProfil
        AgentEtatProfilDTO agentEtatProfilDTO = agentEtatProfilMapper.toDto(agentEtatProfil);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAgentEtatProfilMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(agentEtatProfilDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the AgentEtatProfil in the database
        List<AgentEtatProfil> agentEtatProfilList = agentEtatProfilRepository.findAll();
        assertThat(agentEtatProfilList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAgentEtatProfil() throws Exception {
        int databaseSizeBeforeUpdate = agentEtatProfilRepository.findAll().size();
        agentEtatProfil.setId(longCount.incrementAndGet());

        // Create the AgentEtatProfil
        AgentEtatProfilDTO agentEtatProfilDTO = agentEtatProfilMapper.toDto(agentEtatProfil);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAgentEtatProfilMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(agentEtatProfilDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AgentEtatProfil in the database
        List<AgentEtatProfil> agentEtatProfilList = agentEtatProfilRepository.findAll();
        assertThat(agentEtatProfilList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAgentEtatProfil() throws Exception {
        // Initialize the database
        agentEtatProfilRepository.saveAndFlush(agentEtatProfil);

        int databaseSizeBeforeDelete = agentEtatProfilRepository.findAll().size();

        // Delete the agentEtatProfil
        restAgentEtatProfilMockMvc
            .perform(delete(ENTITY_API_URL_ID, agentEtatProfil.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<AgentEtatProfil> agentEtatProfilList = agentEtatProfilRepository.findAll();
        assertThat(agentEtatProfilList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
