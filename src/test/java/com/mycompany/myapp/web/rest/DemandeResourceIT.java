package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Demande;
import com.mycompany.myapp.domain.enumeration.Type;
import com.mycompany.myapp.repository.DemandeRepository;
import com.mycompany.myapp.service.dto.DemandeDTO;
import com.mycompany.myapp.service.mapper.DemandeMapper;
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
 * Integration tests for the {@link DemandeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DemandeResourceIT {

    private static final Type DEFAULT_OBJET = Type.CREATION_CAISSE;
    private static final Type UPDATED_OBJET = Type.ALIMENTATION_CAISSE;

    private static final Instant DEFAULT_DATE_DEMANDE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_DEMANDE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_MOTIF = "AAAAAAAAAA";
    private static final String UPDATED_MOTIF = "BBBBBBBBBB";

    private static final Instant DEFAULT_DATE_HEURE_MODIFICATION = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_HEURE_MODIFICATION = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_DATE_HEURE_CREATION = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_HEURE_CREATION = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Long DEFAULT_UTI_CREE = 1L;
    private static final Long UPDATED_UTI_CREE = 2L;

    private static final Long DEFAULT_UTI_MODIFIE = 1L;
    private static final Long UPDATED_UTI_MODIFIE = 2L;

    private static final String ENTITY_API_URL = "/api/demandes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DemandeRepository demandeRepository;

    @Autowired
    private DemandeMapper demandeMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDemandeMockMvc;

    private Demande demande;

    public static Demande createEntity(EntityManager em) {
        Demande demande = new Demande();
        demande.setType(DEFAULT_OBJET);
        demande.setDateDemande(DEFAULT_DATE_DEMANDE);
        demande.setMotif(DEFAULT_MOTIF);
        demande.setDateHeureModification(DEFAULT_DATE_HEURE_MODIFICATION);
        demande.setDateHeureCreation(DEFAULT_DATE_HEURE_CREATION);
        demande.setUtiCree(DEFAULT_UTI_CREE);
        demande.setUtiModifie(DEFAULT_UTI_MODIFIE);
        return demande;
    }

    public static Demande createUpdatedEntity(EntityManager em) {
        Demande demande = new Demande();
        demande.setType(UPDATED_OBJET);
        demande.setDateDemande(UPDATED_DATE_DEMANDE);
        demande.setMotif(UPDATED_MOTIF);
        demande.setDateHeureModification(UPDATED_DATE_HEURE_MODIFICATION);
        demande.setDateHeureCreation(UPDATED_DATE_HEURE_CREATION);
        demande.setUtiCree(UPDATED_UTI_CREE);
        demande.setUtiModifie(UPDATED_UTI_MODIFIE);
        return demande;
    }

    @BeforeEach
    public void initTest() {
        demande = createEntity(em);
    }

    @Test
    @Transactional
    void createDemande() throws Exception {
        int databaseSizeBeforeCreate = demandeRepository.findAll().size();
        DemandeDTO demandeDTO = demandeMapper.toDto(demande);
        restDemandeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(demandeDTO)))
            .andExpect(status().isCreated());

        List<Demande> demandeList = demandeRepository.findAll();
        assertThat(demandeList).hasSize(databaseSizeBeforeCreate + 1);
        Demande testDemande = demandeList.get(demandeList.size() - 1);
        assertThat(testDemande.getType()).isEqualTo(DEFAULT_OBJET);
        assertThat(testDemande.getDateDemande()).isEqualTo(DEFAULT_DATE_DEMANDE);
        assertThat(testDemande.getMotif()).isEqualTo(DEFAULT_MOTIF);
        assertThat(testDemande.getDateHeureModification()).isEqualTo(DEFAULT_DATE_HEURE_MODIFICATION);
        assertThat(testDemande.getDateHeureCreation()).isEqualTo(DEFAULT_DATE_HEURE_CREATION);
        assertThat(testDemande.getUtiCree()).isEqualTo(DEFAULT_UTI_CREE);
        assertThat(testDemande.getUtiModifie()).isEqualTo(DEFAULT_UTI_MODIFIE);
    }

    @Test
    @Transactional
    void createDemandeWithExistingId() throws Exception {
        demande.setId(1L);
        DemandeDTO demandeDTO = demandeMapper.toDto(demande);
        int databaseSizeBeforeCreate = demandeRepository.findAll().size();

        restDemandeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(demandeDTO)))
            .andExpect(status().isBadRequest());

        List<Demande> demandeList = demandeRepository.findAll();
        assertThat(demandeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkObjetIsRequired() throws Exception {
        int databaseSizeBeforeTest = demandeRepository.findAll().size();
        demande.setType(null);
        DemandeDTO demandeDTO = demandeMapper.toDto(demande);

        restDemandeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(demandeDTO)))
            .andExpect(status().isBadRequest());

        List<Demande> demandeList = demandeRepository.findAll();
        assertThat(demandeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllDemandes() throws Exception {
        demandeRepository.saveAndFlush(demande);
        restDemandeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(demande.getId().intValue())))
            .andExpect(jsonPath("$.[*].objet").value(hasItem(DEFAULT_OBJET.toString())))
            .andExpect(jsonPath("$.[*].dateDemande").value(hasItem(DEFAULT_DATE_DEMANDE.toString())))
            .andExpect(jsonPath("$.[*].motif").value(hasItem(DEFAULT_MOTIF)))
            .andExpect(jsonPath("$.[*].dateHeureModification").value(hasItem(DEFAULT_DATE_HEURE_MODIFICATION.toString())))
            .andExpect(jsonPath("$.[*].dateHeureCreation").value(hasItem(DEFAULT_DATE_HEURE_CREATION.toString())))
            .andExpect(jsonPath("$.[*].utiCree").value(hasItem(DEFAULT_UTI_CREE.intValue())))
            .andExpect(jsonPath("$.[*].utiModifie").value(hasItem(DEFAULT_UTI_MODIFIE.intValue())));
    }

    @Test
    @Transactional
    void getDemande() throws Exception {
        demandeRepository.saveAndFlush(demande);
        restDemandeMockMvc
            .perform(get(ENTITY_API_URL_ID, demande.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(demande.getId().intValue()))
            .andExpect(jsonPath("$.objet").value(DEFAULT_OBJET.toString()))
            .andExpect(jsonPath("$.dateDemande").value(DEFAULT_DATE_DEMANDE.toString()))
            .andExpect(jsonPath("$.motif").value(DEFAULT_MOTIF))
            .andExpect(jsonPath("$.dateHeureModification").value(DEFAULT_DATE_HEURE_MODIFICATION.toString()))
            .andExpect(jsonPath("$.dateHeureCreation").value(DEFAULT_DATE_HEURE_CREATION.toString()))
            .andExpect(jsonPath("$.utiCree").value(DEFAULT_UTI_CREE.intValue()))
            .andExpect(jsonPath("$.utiModifie").value(DEFAULT_UTI_MODIFIE.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingDemande() throws Exception {
        restDemandeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDemande() throws Exception {
        demandeRepository.saveAndFlush(demande);
        int databaseSizeBeforeUpdate = demandeRepository.findAll().size();

        Demande updatedDemande = demandeRepository.findById(demande.getId()).orElseThrow();
        em.detach(updatedDemande);
        updatedDemande.setType(UPDATED_OBJET);
        updatedDemande.setDateDemande(UPDATED_DATE_DEMANDE);
        updatedDemande.setMotif(UPDATED_MOTIF);
        updatedDemande.setDateHeureModification(UPDATED_DATE_HEURE_MODIFICATION);
        updatedDemande.setDateHeureCreation(UPDATED_DATE_HEURE_CREATION);
        updatedDemande.setUtiCree(UPDATED_UTI_CREE);
        updatedDemande.setUtiModifie(UPDATED_UTI_MODIFIE);

        DemandeDTO demandeDTO = demandeMapper.toDto(updatedDemande);

        restDemandeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, demandeDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(demandeDTO))
            )
            .andExpect(status().isOk());

        List<Demande> demandeList = demandeRepository.findAll();
        assertThat(demandeList).hasSize(databaseSizeBeforeUpdate);
        Demande testDemande = demandeList.get(demandeList.size() - 1);
        assertThat(testDemande.getType()).isEqualTo(UPDATED_OBJET);
        assertThat(testDemande.getDateDemande()).isEqualTo(UPDATED_DATE_DEMANDE);
        assertThat(testDemande.getMotif()).isEqualTo(UPDATED_MOTIF);
        assertThat(testDemande.getDateHeureModification()).isEqualTo(UPDATED_DATE_HEURE_MODIFICATION);
        assertThat(testDemande.getDateHeureCreation()).isEqualTo(UPDATED_DATE_HEURE_CREATION);
        assertThat(testDemande.getUtiCree()).isEqualTo(UPDATED_UTI_CREE);
        assertThat(testDemande.getUtiModifie()).isEqualTo(UPDATED_UTI_MODIFIE);
    }
    // Les autres tests patch et delete doivent également utiliser setType(), setDateDemande(), etc.
    // Remplace toutes les occurrences des appels fluent par les setters classiques
}
