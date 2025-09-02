package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Agent;
import com.mycompany.myapp.repository.AgentRepository;
import com.mycompany.myapp.service.dto.AgentDTO;
import com.mycompany.myapp.service.mapper.AgentMapper;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
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
 * Integration tests for the {@link AgentResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AgentResourceIT {

    private static final String DEFAULT_CODE_MATRILE = "AAAAAAAAAA";
    private static final String UPDATED_CODE_MATRILE = "BBBBBBBBBB";

    private static final String DEFAULT_CNI = "AAAAAAAAAA";
    private static final String UPDATED_CNI = "BBBBBBBBBB";

    private static final String DEFAULT_STATUT_AGENT = "AAAAAAAAAA";
    private static final String UPDATED_STATUT_AGENT = "BBBBBBBBBB";

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String DEFAULT_PRENOM = "AAAAAAAAAA";
    private static final String UPDATED_PRENOM = "BBBBBBBBBB";

    private static final String DEFAULT_SEXE = "AAAAAAAAAA";
    private static final String UPDATED_SEXE = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL_UCAD = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL_UCAD = "BBBBBBBBBB";

    private static final String DEFAULT_TELEPHONE = "AAAAAAAAAA";
    private static final String UPDATED_TELEPHONE = "BBBBBBBBBB";

    private static final String DEFAULT_FONCTION_AGENT = "AAAAAAAAAA";
    private static final String UPDATED_FONCTION_AGENT = "BBBBBBBBBB";

    private static final String DEFAULT_TYPE_PERSONNEL = "AAAAAAAAAA";
    private static final String UPDATED_TYPE_PERSONNEL = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATE_DE_NAISSANCE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_DE_NAISSANCE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_LIEU_NAISSANCE = "AAAAAAAAAA";
    private static final String UPDATED_LIEU_NAISSANCE = "BBBBBBBBBB";

    private static final String DEFAULT_NATIONALITE = "AAAAAAAAAA";
    private static final String UPDATED_NATIONALITE = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_ADRESSE = "AAAAAAAAAA";
    private static final String UPDATED_ADRESSE = "BBBBBBBBBB";

    private static final Boolean DEFAULT_EXTERNE = false;
    private static final Boolean UPDATED_EXTERNE = true;

    private static final Boolean DEFAULT_ACTIF = false;
    private static final Boolean UPDATED_ACTIF = true;

    private static final String DEFAULT_ROLE = "AAAAAAAAAA";
    private static final String UPDATED_ROLE = "BBBBBBBBBB";

    private static final Instant DEFAULT_DATE_HEURE_MODIFICATION = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_HEURE_MODIFICATION = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_DATE_HEURE_CREATION = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_HEURE_CREATION = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_MODIFIED_BY = "AAAAAAAAAA";
    private static final String UPDATED_MODIFIED_BY = "BBBBBBBBBB";

    private static final String DEFAULT_CREATED_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATED_BY = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/agents";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AgentRepository agentRepository;

    @Autowired
    private AgentMapper agentMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAgentMockMvc;

    private Agent agent;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Agent createEntity(EntityManager em) {
        Agent agent = new Agent()
            .codeMatrile(DEFAULT_CODE_MATRILE)
            .cni(DEFAULT_CNI)
            .statutAgent(DEFAULT_STATUT_AGENT)
            .nom(DEFAULT_NOM)
            .prenom(DEFAULT_PRENOM)
            .sexe(DEFAULT_SEXE)
            .emailUcad(DEFAULT_EMAIL_UCAD)
            .telephone(DEFAULT_TELEPHONE)
            .fonctionAgent(DEFAULT_FONCTION_AGENT)
            .typePersonnel(DEFAULT_TYPE_PERSONNEL)
            .dateDeNaissance(DEFAULT_DATE_DE_NAISSANCE)
            .lieuNaissance(DEFAULT_LIEU_NAISSANCE)
            .nationalite(DEFAULT_NATIONALITE)
            .email(DEFAULT_EMAIL)
            .adresse(DEFAULT_ADRESSE)
            .externe(DEFAULT_EXTERNE)
            .actif(DEFAULT_ACTIF)
            .role(DEFAULT_ROLE)
            .dateHeureModification(DEFAULT_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(DEFAULT_DATE_HEURE_CREATION)
            .modifiedBy(DEFAULT_MODIFIED_BY)
            .createdBy(DEFAULT_CREATED_BY);
        return agent;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Agent createUpdatedEntity(EntityManager em) {
        Agent agent = new Agent()
            .codeMatrile(UPDATED_CODE_MATRILE)
            .cni(UPDATED_CNI)
            .statutAgent(UPDATED_STATUT_AGENT)
            .nom(UPDATED_NOM)
            .prenom(UPDATED_PRENOM)
            .sexe(UPDATED_SEXE)
            .emailUcad(UPDATED_EMAIL_UCAD)
            .telephone(UPDATED_TELEPHONE)
            .fonctionAgent(UPDATED_FONCTION_AGENT)
            .typePersonnel(UPDATED_TYPE_PERSONNEL)
            .dateDeNaissance(UPDATED_DATE_DE_NAISSANCE)
            .lieuNaissance(UPDATED_LIEU_NAISSANCE)
            .nationalite(UPDATED_NATIONALITE)
            .email(UPDATED_EMAIL)
            .adresse(UPDATED_ADRESSE)
            .externe(UPDATED_EXTERNE)
            .actif(UPDATED_ACTIF)
            .role(UPDATED_ROLE)
            .dateHeureModification(UPDATED_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(UPDATED_DATE_HEURE_CREATION)
            .modifiedBy(UPDATED_MODIFIED_BY)
            .createdBy(UPDATED_CREATED_BY);
        return agent;
    }

    @BeforeEach
    public void initTest() {
        agent = createEntity(em);
    }

    @Test
    @Transactional
    void createAgent() throws Exception {
        int databaseSizeBeforeCreate = agentRepository.findAll().size();
        // Create the Agent
        AgentDTO agentDTO = agentMapper.toDto(agent);
        restAgentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(agentDTO)))
            .andExpect(status().isCreated());

        // Validate the Agent in the database
        List<Agent> agentList = agentRepository.findAll();
        assertThat(agentList).hasSize(databaseSizeBeforeCreate + 1);
        Agent testAgent = agentList.get(agentList.size() - 1);
        assertThat(testAgent.getCodeMatrile()).isEqualTo(DEFAULT_CODE_MATRILE);
        assertThat(testAgent.getCni()).isEqualTo(DEFAULT_CNI);
        assertThat(testAgent.getStatutAgent()).isEqualTo(DEFAULT_STATUT_AGENT);
        assertThat(testAgent.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testAgent.getPrenom()).isEqualTo(DEFAULT_PRENOM);
        assertThat(testAgent.getSexe()).isEqualTo(DEFAULT_SEXE);
        assertThat(testAgent.getEmailUcad()).isEqualTo(DEFAULT_EMAIL_UCAD);
        assertThat(testAgent.getTelephone()).isEqualTo(DEFAULT_TELEPHONE);
        assertThat(testAgent.getFonctionAgent()).isEqualTo(DEFAULT_FONCTION_AGENT);
        assertThat(testAgent.getTypePersonnel()).isEqualTo(DEFAULT_TYPE_PERSONNEL);
        assertThat(testAgent.getDateDeNaissance()).isEqualTo(DEFAULT_DATE_DE_NAISSANCE);
        assertThat(testAgent.getLieuNaissance()).isEqualTo(DEFAULT_LIEU_NAISSANCE);
        assertThat(testAgent.getNationalite()).isEqualTo(DEFAULT_NATIONALITE);
        assertThat(testAgent.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testAgent.getAdresse()).isEqualTo(DEFAULT_ADRESSE);
        assertThat(testAgent.getExterne()).isEqualTo(DEFAULT_EXTERNE);
        assertThat(testAgent.getActif()).isEqualTo(DEFAULT_ACTIF);
        assertThat(testAgent.getRole()).isEqualTo(DEFAULT_ROLE);
        assertThat(testAgent.getDateHeureModification()).isEqualTo(DEFAULT_DATE_HEURE_MODIFICATION);
        assertThat(testAgent.getDateHeureCreation()).isEqualTo(DEFAULT_DATE_HEURE_CREATION);
        assertThat(testAgent.getModifiedBy()).isEqualTo(DEFAULT_MODIFIED_BY);
        assertThat(testAgent.getCreatedBy()).isEqualTo(DEFAULT_CREATED_BY);
    }

    @Test
    @Transactional
    void createAgentWithExistingId() throws Exception {
        // Create the Agent with an existing ID
        agent.setId(1L);
        AgentDTO agentDTO = agentMapper.toDto(agent);

        int databaseSizeBeforeCreate = agentRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAgentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(agentDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Agent in the database
        List<Agent> agentList = agentRepository.findAll();
        assertThat(agentList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkCodeMatrileIsRequired() throws Exception {
        int databaseSizeBeforeTest = agentRepository.findAll().size();
        // set the field null
        agent.setCodeMatrile(null);

        // Create the Agent, which fails.
        AgentDTO agentDTO = agentMapper.toDto(agent);

        restAgentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(agentDTO)))
            .andExpect(status().isBadRequest());

        List<Agent> agentList = agentRepository.findAll();
        assertThat(agentList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCniIsRequired() throws Exception {
        int databaseSizeBeforeTest = agentRepository.findAll().size();
        // set the field null
        agent.setCni(null);

        // Create the Agent, which fails.
        AgentDTO agentDTO = agentMapper.toDto(agent);

        restAgentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(agentDTO)))
            .andExpect(status().isBadRequest());

        List<Agent> agentList = agentRepository.findAll();
        assertThat(agentList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEmailUcadIsRequired() throws Exception {
        int databaseSizeBeforeTest = agentRepository.findAll().size();
        // set the field null
        agent.setEmailUcad(null);

        // Create the Agent, which fails.
        AgentDTO agentDTO = agentMapper.toDto(agent);

        restAgentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(agentDTO)))
            .andExpect(status().isBadRequest());

        List<Agent> agentList = agentRepository.findAll();
        assertThat(agentList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAgents() throws Exception {
        // Initialize the database
        agentRepository.saveAndFlush(agent);

        // Get all the agentList
        restAgentMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(agent.getId().intValue())))
            .andExpect(jsonPath("$.[*].codeMatrile").value(hasItem(DEFAULT_CODE_MATRILE)))
            .andExpect(jsonPath("$.[*].cni").value(hasItem(DEFAULT_CNI)))
            .andExpect(jsonPath("$.[*].statutAgent").value(hasItem(DEFAULT_STATUT_AGENT)))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].prenom").value(hasItem(DEFAULT_PRENOM)))
            .andExpect(jsonPath("$.[*].sexe").value(hasItem(DEFAULT_SEXE)))
            .andExpect(jsonPath("$.[*].emailUcad").value(hasItem(DEFAULT_EMAIL_UCAD)))
            .andExpect(jsonPath("$.[*].telephone").value(hasItem(DEFAULT_TELEPHONE)))
            .andExpect(jsonPath("$.[*].fonctionAgent").value(hasItem(DEFAULT_FONCTION_AGENT)))
            .andExpect(jsonPath("$.[*].typePersonnel").value(hasItem(DEFAULT_TYPE_PERSONNEL)))
            .andExpect(jsonPath("$.[*].dateDeNaissance").value(hasItem(DEFAULT_DATE_DE_NAISSANCE.toString())))
            .andExpect(jsonPath("$.[*].lieuNaissance").value(hasItem(DEFAULT_LIEU_NAISSANCE)))
            .andExpect(jsonPath("$.[*].nationalite").value(hasItem(DEFAULT_NATIONALITE)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].adresse").value(hasItem(DEFAULT_ADRESSE)))
            .andExpect(jsonPath("$.[*].externe").value(hasItem(DEFAULT_EXTERNE.booleanValue())))
            .andExpect(jsonPath("$.[*].actif").value(hasItem(DEFAULT_ACTIF.booleanValue())))
            .andExpect(jsonPath("$.[*].role").value(hasItem(DEFAULT_ROLE)))
            .andExpect(jsonPath("$.[*].dateHeureModification").value(hasItem(DEFAULT_DATE_HEURE_MODIFICATION.toString())))
            .andExpect(jsonPath("$.[*].dateHeureCreation").value(hasItem(DEFAULT_DATE_HEURE_CREATION.toString())))
            .andExpect(jsonPath("$.[*].modifiedBy").value(hasItem(DEFAULT_MODIFIED_BY)))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)));
    }

    @Test
    @Transactional
    void getAgent() throws Exception {
        // Initialize the database
        agentRepository.saveAndFlush(agent);

        // Get the agent
        restAgentMockMvc
            .perform(get(ENTITY_API_URL_ID, agent.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(agent.getId().intValue()))
            .andExpect(jsonPath("$.codeMatrile").value(DEFAULT_CODE_MATRILE))
            .andExpect(jsonPath("$.cni").value(DEFAULT_CNI))
            .andExpect(jsonPath("$.statutAgent").value(DEFAULT_STATUT_AGENT))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.prenom").value(DEFAULT_PRENOM))
            .andExpect(jsonPath("$.sexe").value(DEFAULT_SEXE))
            .andExpect(jsonPath("$.emailUcad").value(DEFAULT_EMAIL_UCAD))
            .andExpect(jsonPath("$.telephone").value(DEFAULT_TELEPHONE))
            .andExpect(jsonPath("$.fonctionAgent").value(DEFAULT_FONCTION_AGENT))
            .andExpect(jsonPath("$.typePersonnel").value(DEFAULT_TYPE_PERSONNEL))
            .andExpect(jsonPath("$.dateDeNaissance").value(DEFAULT_DATE_DE_NAISSANCE.toString()))
            .andExpect(jsonPath("$.lieuNaissance").value(DEFAULT_LIEU_NAISSANCE))
            .andExpect(jsonPath("$.nationalite").value(DEFAULT_NATIONALITE))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.adresse").value(DEFAULT_ADRESSE))
            .andExpect(jsonPath("$.externe").value(DEFAULT_EXTERNE.booleanValue()))
            .andExpect(jsonPath("$.actif").value(DEFAULT_ACTIF.booleanValue()))
            .andExpect(jsonPath("$.role").value(DEFAULT_ROLE))
            .andExpect(jsonPath("$.dateHeureModification").value(DEFAULT_DATE_HEURE_MODIFICATION.toString()))
            .andExpect(jsonPath("$.dateHeureCreation").value(DEFAULT_DATE_HEURE_CREATION.toString()))
            .andExpect(jsonPath("$.modifiedBy").value(DEFAULT_MODIFIED_BY))
            .andExpect(jsonPath("$.createdBy").value(DEFAULT_CREATED_BY));
    }

    @Test
    @Transactional
    void getNonExistingAgent() throws Exception {
        // Get the agent
        restAgentMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAgent() throws Exception {
        // Initialize the database
        agentRepository.saveAndFlush(agent);

        int databaseSizeBeforeUpdate = agentRepository.findAll().size();

        // Update the agent
        Agent updatedAgent = agentRepository.findById(agent.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedAgent are not directly saved in db
        em.detach(updatedAgent);
        updatedAgent
            .codeMatrile(UPDATED_CODE_MATRILE)
            .cni(UPDATED_CNI)
            .statutAgent(UPDATED_STATUT_AGENT)
            .nom(UPDATED_NOM)
            .prenom(UPDATED_PRENOM)
            .sexe(UPDATED_SEXE)
            .emailUcad(UPDATED_EMAIL_UCAD)
            .telephone(UPDATED_TELEPHONE)
            .fonctionAgent(UPDATED_FONCTION_AGENT)
            .typePersonnel(UPDATED_TYPE_PERSONNEL)
            .dateDeNaissance(UPDATED_DATE_DE_NAISSANCE)
            .lieuNaissance(UPDATED_LIEU_NAISSANCE)
            .nationalite(UPDATED_NATIONALITE)
            .email(UPDATED_EMAIL)
            .adresse(UPDATED_ADRESSE)
            .externe(UPDATED_EXTERNE)
            .actif(UPDATED_ACTIF)
            .role(UPDATED_ROLE)
            .dateHeureModification(UPDATED_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(UPDATED_DATE_HEURE_CREATION)
            .modifiedBy(UPDATED_MODIFIED_BY)
            .createdBy(UPDATED_CREATED_BY);
        AgentDTO agentDTO = agentMapper.toDto(updatedAgent);

        restAgentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, agentDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(agentDTO))
            )
            .andExpect(status().isOk());

        // Validate the Agent in the database
        List<Agent> agentList = agentRepository.findAll();
        assertThat(agentList).hasSize(databaseSizeBeforeUpdate);
        Agent testAgent = agentList.get(agentList.size() - 1);
        assertThat(testAgent.getCodeMatrile()).isEqualTo(UPDATED_CODE_MATRILE);
        assertThat(testAgent.getCni()).isEqualTo(UPDATED_CNI);
        assertThat(testAgent.getStatutAgent()).isEqualTo(UPDATED_STATUT_AGENT);
        assertThat(testAgent.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testAgent.getPrenom()).isEqualTo(UPDATED_PRENOM);
        assertThat(testAgent.getSexe()).isEqualTo(UPDATED_SEXE);
        assertThat(testAgent.getEmailUcad()).isEqualTo(UPDATED_EMAIL_UCAD);
        assertThat(testAgent.getTelephone()).isEqualTo(UPDATED_TELEPHONE);
        assertThat(testAgent.getFonctionAgent()).isEqualTo(UPDATED_FONCTION_AGENT);
        assertThat(testAgent.getTypePersonnel()).isEqualTo(UPDATED_TYPE_PERSONNEL);
        assertThat(testAgent.getDateDeNaissance()).isEqualTo(UPDATED_DATE_DE_NAISSANCE);
        assertThat(testAgent.getLieuNaissance()).isEqualTo(UPDATED_LIEU_NAISSANCE);
        assertThat(testAgent.getNationalite()).isEqualTo(UPDATED_NATIONALITE);
        assertThat(testAgent.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testAgent.getAdresse()).isEqualTo(UPDATED_ADRESSE);
        assertThat(testAgent.getExterne()).isEqualTo(UPDATED_EXTERNE);
        assertThat(testAgent.getActif()).isEqualTo(UPDATED_ACTIF);
        assertThat(testAgent.getRole()).isEqualTo(UPDATED_ROLE);
        assertThat(testAgent.getDateHeureModification()).isEqualTo(UPDATED_DATE_HEURE_MODIFICATION);
        assertThat(testAgent.getDateHeureCreation()).isEqualTo(UPDATED_DATE_HEURE_CREATION);
        assertThat(testAgent.getModifiedBy()).isEqualTo(UPDATED_MODIFIED_BY);
        assertThat(testAgent.getCreatedBy()).isEqualTo(UPDATED_CREATED_BY);
    }

    @Test
    @Transactional
    void putNonExistingAgent() throws Exception {
        int databaseSizeBeforeUpdate = agentRepository.findAll().size();
        agent.setId(longCount.incrementAndGet());

        // Create the Agent
        AgentDTO agentDTO = agentMapper.toDto(agent);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAgentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, agentDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(agentDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Agent in the database
        List<Agent> agentList = agentRepository.findAll();
        assertThat(agentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAgent() throws Exception {
        int databaseSizeBeforeUpdate = agentRepository.findAll().size();
        agent.setId(longCount.incrementAndGet());

        // Create the Agent
        AgentDTO agentDTO = agentMapper.toDto(agent);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAgentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(agentDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Agent in the database
        List<Agent> agentList = agentRepository.findAll();
        assertThat(agentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAgent() throws Exception {
        int databaseSizeBeforeUpdate = agentRepository.findAll().size();
        agent.setId(longCount.incrementAndGet());

        // Create the Agent
        AgentDTO agentDTO = agentMapper.toDto(agent);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAgentMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(agentDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Agent in the database
        List<Agent> agentList = agentRepository.findAll();
        assertThat(agentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAgentWithPatch() throws Exception {
        // Initialize the database
        agentRepository.saveAndFlush(agent);

        int databaseSizeBeforeUpdate = agentRepository.findAll().size();

        // Update the agent using partial update
        Agent partialUpdatedAgent = new Agent();
        partialUpdatedAgent.setId(agent.getId());

        partialUpdatedAgent
            .statutAgent(UPDATED_STATUT_AGENT)
            .sexe(UPDATED_SEXE)
            .telephone(UPDATED_TELEPHONE)
            .fonctionAgent(UPDATED_FONCTION_AGENT)
            .dateDeNaissance(UPDATED_DATE_DE_NAISSANCE)
            .nationalite(UPDATED_NATIONALITE)
            .adresse(UPDATED_ADRESSE)
            .role(UPDATED_ROLE)
            .dateHeureModification(UPDATED_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(UPDATED_DATE_HEURE_CREATION)
            .modifiedBy(UPDATED_MODIFIED_BY)
            .createdBy(UPDATED_CREATED_BY);

        restAgentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAgent.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAgent))
            )
            .andExpect(status().isOk());

        // Validate the Agent in the database
        List<Agent> agentList = agentRepository.findAll();
        assertThat(agentList).hasSize(databaseSizeBeforeUpdate);
        Agent testAgent = agentList.get(agentList.size() - 1);
        assertThat(testAgent.getCodeMatrile()).isEqualTo(DEFAULT_CODE_MATRILE);
        assertThat(testAgent.getCni()).isEqualTo(DEFAULT_CNI);
        assertThat(testAgent.getStatutAgent()).isEqualTo(UPDATED_STATUT_AGENT);
        assertThat(testAgent.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testAgent.getPrenom()).isEqualTo(DEFAULT_PRENOM);
        assertThat(testAgent.getSexe()).isEqualTo(UPDATED_SEXE);
        assertThat(testAgent.getEmailUcad()).isEqualTo(DEFAULT_EMAIL_UCAD);
        assertThat(testAgent.getTelephone()).isEqualTo(UPDATED_TELEPHONE);
        assertThat(testAgent.getFonctionAgent()).isEqualTo(UPDATED_FONCTION_AGENT);
        assertThat(testAgent.getTypePersonnel()).isEqualTo(DEFAULT_TYPE_PERSONNEL);
        assertThat(testAgent.getDateDeNaissance()).isEqualTo(UPDATED_DATE_DE_NAISSANCE);
        assertThat(testAgent.getLieuNaissance()).isEqualTo(DEFAULT_LIEU_NAISSANCE);
        assertThat(testAgent.getNationalite()).isEqualTo(UPDATED_NATIONALITE);
        assertThat(testAgent.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testAgent.getAdresse()).isEqualTo(UPDATED_ADRESSE);
        assertThat(testAgent.getExterne()).isEqualTo(DEFAULT_EXTERNE);
        assertThat(testAgent.getActif()).isEqualTo(DEFAULT_ACTIF);
        assertThat(testAgent.getRole()).isEqualTo(UPDATED_ROLE);
        assertThat(testAgent.getDateHeureModification()).isEqualTo(UPDATED_DATE_HEURE_MODIFICATION);
        assertThat(testAgent.getDateHeureCreation()).isEqualTo(UPDATED_DATE_HEURE_CREATION);
        assertThat(testAgent.getModifiedBy()).isEqualTo(UPDATED_MODIFIED_BY);
        assertThat(testAgent.getCreatedBy()).isEqualTo(UPDATED_CREATED_BY);
    }

    @Test
    @Transactional
    void fullUpdateAgentWithPatch() throws Exception {
        // Initialize the database
        agentRepository.saveAndFlush(agent);

        int databaseSizeBeforeUpdate = agentRepository.findAll().size();

        // Update the agent using partial update
        Agent partialUpdatedAgent = new Agent();
        partialUpdatedAgent.setId(agent.getId());

        partialUpdatedAgent
            .codeMatrile(UPDATED_CODE_MATRILE)
            .cni(UPDATED_CNI)
            .statutAgent(UPDATED_STATUT_AGENT)
            .nom(UPDATED_NOM)
            .prenom(UPDATED_PRENOM)
            .sexe(UPDATED_SEXE)
            .emailUcad(UPDATED_EMAIL_UCAD)
            .telephone(UPDATED_TELEPHONE)
            .fonctionAgent(UPDATED_FONCTION_AGENT)
            .typePersonnel(UPDATED_TYPE_PERSONNEL)
            .dateDeNaissance(UPDATED_DATE_DE_NAISSANCE)
            .lieuNaissance(UPDATED_LIEU_NAISSANCE)
            .nationalite(UPDATED_NATIONALITE)
            .email(UPDATED_EMAIL)
            .adresse(UPDATED_ADRESSE)
            .externe(UPDATED_EXTERNE)
            .actif(UPDATED_ACTIF)
            .role(UPDATED_ROLE)
            .dateHeureModification(UPDATED_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(UPDATED_DATE_HEURE_CREATION)
            .modifiedBy(UPDATED_MODIFIED_BY)
            .createdBy(UPDATED_CREATED_BY);

        restAgentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAgent.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAgent))
            )
            .andExpect(status().isOk());

        // Validate the Agent in the database
        List<Agent> agentList = agentRepository.findAll();
        assertThat(agentList).hasSize(databaseSizeBeforeUpdate);
        Agent testAgent = agentList.get(agentList.size() - 1);
        assertThat(testAgent.getCodeMatrile()).isEqualTo(UPDATED_CODE_MATRILE);
        assertThat(testAgent.getCni()).isEqualTo(UPDATED_CNI);
        assertThat(testAgent.getStatutAgent()).isEqualTo(UPDATED_STATUT_AGENT);
        assertThat(testAgent.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testAgent.getPrenom()).isEqualTo(UPDATED_PRENOM);
        assertThat(testAgent.getSexe()).isEqualTo(UPDATED_SEXE);
        assertThat(testAgent.getEmailUcad()).isEqualTo(UPDATED_EMAIL_UCAD);
        assertThat(testAgent.getTelephone()).isEqualTo(UPDATED_TELEPHONE);
        assertThat(testAgent.getFonctionAgent()).isEqualTo(UPDATED_FONCTION_AGENT);
        assertThat(testAgent.getTypePersonnel()).isEqualTo(UPDATED_TYPE_PERSONNEL);
        assertThat(testAgent.getDateDeNaissance()).isEqualTo(UPDATED_DATE_DE_NAISSANCE);
        assertThat(testAgent.getLieuNaissance()).isEqualTo(UPDATED_LIEU_NAISSANCE);
        assertThat(testAgent.getNationalite()).isEqualTo(UPDATED_NATIONALITE);
        assertThat(testAgent.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testAgent.getAdresse()).isEqualTo(UPDATED_ADRESSE);
        assertThat(testAgent.getExterne()).isEqualTo(UPDATED_EXTERNE);
        assertThat(testAgent.getActif()).isEqualTo(UPDATED_ACTIF);
        assertThat(testAgent.getRole()).isEqualTo(UPDATED_ROLE);
        assertThat(testAgent.getDateHeureModification()).isEqualTo(UPDATED_DATE_HEURE_MODIFICATION);
        assertThat(testAgent.getDateHeureCreation()).isEqualTo(UPDATED_DATE_HEURE_CREATION);
        assertThat(testAgent.getModifiedBy()).isEqualTo(UPDATED_MODIFIED_BY);
        assertThat(testAgent.getCreatedBy()).isEqualTo(UPDATED_CREATED_BY);
    }

    @Test
    @Transactional
    void patchNonExistingAgent() throws Exception {
        int databaseSizeBeforeUpdate = agentRepository.findAll().size();
        agent.setId(longCount.incrementAndGet());

        // Create the Agent
        AgentDTO agentDTO = agentMapper.toDto(agent);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAgentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, agentDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(agentDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Agent in the database
        List<Agent> agentList = agentRepository.findAll();
        assertThat(agentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAgent() throws Exception {
        int databaseSizeBeforeUpdate = agentRepository.findAll().size();
        agent.setId(longCount.incrementAndGet());

        // Create the Agent
        AgentDTO agentDTO = agentMapper.toDto(agent);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAgentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(agentDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Agent in the database
        List<Agent> agentList = agentRepository.findAll();
        assertThat(agentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAgent() throws Exception {
        int databaseSizeBeforeUpdate = agentRepository.findAll().size();
        agent.setId(longCount.incrementAndGet());

        // Create the Agent
        AgentDTO agentDTO = agentMapper.toDto(agent);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAgentMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(agentDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Agent in the database
        List<Agent> agentList = agentRepository.findAll();
        assertThat(agentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAgent() throws Exception {
        // Initialize the database
        agentRepository.saveAndFlush(agent);

        int databaseSizeBeforeDelete = agentRepository.findAll().size();

        // Delete the agent
        restAgentMockMvc
            .perform(delete(ENTITY_API_URL_ID, agent.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Agent> agentList = agentRepository.findAll();
        assertThat(agentList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
