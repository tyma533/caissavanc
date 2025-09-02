package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Caisse;
import com.mycompany.myapp.domain.enumeration.EtatCaisse;
import com.mycompany.myapp.repository.CaisseRepository;
import com.mycompany.myapp.service.dto.CaisseDTO;
import com.mycompany.myapp.service.mapper.CaisseMapper;
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
 * Integration tests for the {@link CaisseResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CaisseResourceIT {

    private static final String DEFAULT_LIBELLE = "AAAAAAAAAA";
    private static final String UPDATED_LIBELLE = "BBBBBBBBBB";

    private static final Instant DEFAULT_DATE_CREATION_CAISSE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_CREATION_CAISSE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_DATE_FERMITURE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_FERMITURE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Long DEFAULT_SOLDE = 1L;
    private static final Long UPDATED_SOLDE = 2L;

    private static final EtatCaisse DEFAULT_ETAT = EtatCaisse.OUVERTE;
    private static final EtatCaisse UPDATED_ETAT = EtatCaisse.EN_CONTROLE;

    private static final Instant DEFAULT_DATE_HEURE_MODIFICATION = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_HEURE_MODIFICATION = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_DATE_HEURE_CREATION = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_HEURE_CREATION = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Long DEFAULT_UTI_CREE = 1L;
    private static final Long UPDATED_UTI_CREE = 2L;

    private static final Long DEFAULT_UTI_MODIFIE = 1L;
    private static final Long UPDATED_UTI_MODIFIE = 2L;

    private static final String ENTITY_API_URL = "/api/caisses";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CaisseRepository caisseRepository;

    @Autowired
    private CaisseMapper caisseMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCaisseMockMvc;

    private Caisse caisse;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Caisse createEntity(EntityManager em) {
        Caisse caisse = new Caisse()
            .libelle(DEFAULT_LIBELLE)
            .dateCreationCaisse(DEFAULT_DATE_CREATION_CAISSE)
            .dateFermiture(DEFAULT_DATE_FERMITURE)
            .solde(DEFAULT_SOLDE)
            .etat(DEFAULT_ETAT)
            .dateHeureModification(DEFAULT_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(DEFAULT_DATE_HEURE_CREATION)
            .utiCree(DEFAULT_UTI_CREE)
            .utiModifie(DEFAULT_UTI_MODIFIE);
        return caisse;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Caisse createUpdatedEntity(EntityManager em) {
        Caisse caisse = new Caisse()
            .libelle(UPDATED_LIBELLE)
            .dateCreationCaisse(UPDATED_DATE_CREATION_CAISSE)
            .dateFermiture(UPDATED_DATE_FERMITURE)
            .solde(UPDATED_SOLDE)
            .etat(UPDATED_ETAT)
            .dateHeureModification(UPDATED_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(UPDATED_DATE_HEURE_CREATION)
            .utiCree(UPDATED_UTI_CREE)
            .utiModifie(UPDATED_UTI_MODIFIE);
        return caisse;
    }

    @BeforeEach
    public void initTest() {
        caisse = createEntity(em);
    }

    @Test
    @Transactional
    void createCaisse() throws Exception {
        int databaseSizeBeforeCreate = caisseRepository.findAll().size();
        // Create the Caisse
        CaisseDTO caisseDTO = caisseMapper.toDto(caisse);
        restCaisseMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(caisseDTO)))
            .andExpect(status().isCreated());

        // Validate the Caisse in the database
        List<Caisse> caisseList = caisseRepository.findAll();
        assertThat(caisseList).hasSize(databaseSizeBeforeCreate + 1);
        Caisse testCaisse = caisseList.get(caisseList.size() - 1);
        assertThat(testCaisse.getLibelle()).isEqualTo(DEFAULT_LIBELLE);
        assertThat(testCaisse.getDateCreationCaisse()).isEqualTo(DEFAULT_DATE_CREATION_CAISSE);
        assertThat(testCaisse.getDateFermiture()).isEqualTo(DEFAULT_DATE_FERMITURE);
        assertThat(testCaisse.getSolde()).isEqualTo(DEFAULT_SOLDE);
        assertThat(testCaisse.getEtat()).isEqualTo(DEFAULT_ETAT);
        assertThat(testCaisse.getDateHeureModification()).isEqualTo(DEFAULT_DATE_HEURE_MODIFICATION);
        assertThat(testCaisse.getDateHeureCreation()).isEqualTo(DEFAULT_DATE_HEURE_CREATION);
        assertThat(testCaisse.getUtiCree()).isEqualTo(DEFAULT_UTI_CREE);
        assertThat(testCaisse.getUtiModifie()).isEqualTo(DEFAULT_UTI_MODIFIE);
    }

    @Test
    @Transactional
    void createCaisseWithExistingId() throws Exception {
        // Create the Caisse with an existing ID
        caisse.setId(1L);
        CaisseDTO caisseDTO = caisseMapper.toDto(caisse);

        int databaseSizeBeforeCreate = caisseRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCaisseMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(caisseDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Caisse in the database
        List<Caisse> caisseList = caisseRepository.findAll();
        assertThat(caisseList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkLibelleIsRequired() throws Exception {
        int databaseSizeBeforeTest = caisseRepository.findAll().size();
        // set the field null
        caisse.setLibelle(null);

        // Create the Caisse, which fails.
        CaisseDTO caisseDTO = caisseMapper.toDto(caisse);

        restCaisseMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(caisseDTO)))
            .andExpect(status().isBadRequest());

        List<Caisse> caisseList = caisseRepository.findAll();
        assertThat(caisseList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkSoldeIsRequired() throws Exception {
        int databaseSizeBeforeTest = caisseRepository.findAll().size();
        // set the field null
        caisse.setSolde(null);

        // Create the Caisse, which fails.
        CaisseDTO caisseDTO = caisseMapper.toDto(caisse);

        restCaisseMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(caisseDTO)))
            .andExpect(status().isBadRequest());

        List<Caisse> caisseList = caisseRepository.findAll();
        assertThat(caisseList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEtatIsRequired() throws Exception {
        int databaseSizeBeforeTest = caisseRepository.findAll().size();
        // set the field null
        caisse.setEtat(null);

        // Create the Caisse, which fails.
        CaisseDTO caisseDTO = caisseMapper.toDto(caisse);

        restCaisseMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(caisseDTO)))
            .andExpect(status().isBadRequest());

        List<Caisse> caisseList = caisseRepository.findAll();
        assertThat(caisseList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllCaisses() throws Exception {
        // Initialize the database
        caisseRepository.saveAndFlush(caisse);

        // Get all the caisseList
        restCaisseMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(caisse.getId().intValue())))
            .andExpect(jsonPath("$.[*].libelle").value(hasItem(DEFAULT_LIBELLE)))
            .andExpect(jsonPath("$.[*].dateCreationCaisse").value(hasItem(DEFAULT_DATE_CREATION_CAISSE.toString())))
            .andExpect(jsonPath("$.[*].dateFermiture").value(hasItem(DEFAULT_DATE_FERMITURE.toString())))
            .andExpect(jsonPath("$.[*].solde").value(hasItem(DEFAULT_SOLDE.intValue())))
            .andExpect(jsonPath("$.[*].etat").value(hasItem(DEFAULT_ETAT.toString())))
            .andExpect(jsonPath("$.[*].dateHeureModification").value(hasItem(DEFAULT_DATE_HEURE_MODIFICATION.toString())))
            .andExpect(jsonPath("$.[*].dateHeureCreation").value(hasItem(DEFAULT_DATE_HEURE_CREATION.toString())))
            .andExpect(jsonPath("$.[*].utiCree").value(hasItem(DEFAULT_UTI_CREE.intValue())))
            .andExpect(jsonPath("$.[*].utiModifie").value(hasItem(DEFAULT_UTI_MODIFIE.intValue())));
    }

    @Test
    @Transactional
    void getCaisse() throws Exception {
        // Initialize the database
        caisseRepository.saveAndFlush(caisse);

        // Get the caisse
        restCaisseMockMvc
            .perform(get(ENTITY_API_URL_ID, caisse.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(caisse.getId().intValue()))
            .andExpect(jsonPath("$.libelle").value(DEFAULT_LIBELLE))
            .andExpect(jsonPath("$.dateCreationCaisse").value(DEFAULT_DATE_CREATION_CAISSE.toString()))
            .andExpect(jsonPath("$.dateFermiture").value(DEFAULT_DATE_FERMITURE.toString()))
            .andExpect(jsonPath("$.solde").value(DEFAULT_SOLDE.intValue()))
            .andExpect(jsonPath("$.etat").value(DEFAULT_ETAT.toString()))
            .andExpect(jsonPath("$.dateHeureModification").value(DEFAULT_DATE_HEURE_MODIFICATION.toString()))
            .andExpect(jsonPath("$.dateHeureCreation").value(DEFAULT_DATE_HEURE_CREATION.toString()))
            .andExpect(jsonPath("$.utiCree").value(DEFAULT_UTI_CREE.intValue()))
            .andExpect(jsonPath("$.utiModifie").value(DEFAULT_UTI_MODIFIE.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingCaisse() throws Exception {
        // Get the caisse
        restCaisseMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCaisse() throws Exception {
        // Initialize the database
        caisseRepository.saveAndFlush(caisse);

        int databaseSizeBeforeUpdate = caisseRepository.findAll().size();

        // Update the caisse
        Caisse updatedCaisse = caisseRepository.findById(caisse.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedCaisse are not directly saved in db
        em.detach(updatedCaisse);
        updatedCaisse
            .libelle(UPDATED_LIBELLE)
            .dateCreationCaisse(UPDATED_DATE_CREATION_CAISSE)
            .dateFermiture(UPDATED_DATE_FERMITURE)
            .solde(UPDATED_SOLDE)
            .etat(UPDATED_ETAT)
            .dateHeureModification(UPDATED_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(UPDATED_DATE_HEURE_CREATION)
            .utiCree(UPDATED_UTI_CREE)
            .utiModifie(UPDATED_UTI_MODIFIE);
        CaisseDTO caisseDTO = caisseMapper.toDto(updatedCaisse);

        restCaisseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, caisseDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(caisseDTO))
            )
            .andExpect(status().isOk());

        // Validate the Caisse in the database
        List<Caisse> caisseList = caisseRepository.findAll();
        assertThat(caisseList).hasSize(databaseSizeBeforeUpdate);
        Caisse testCaisse = caisseList.get(caisseList.size() - 1);
        assertThat(testCaisse.getLibelle()).isEqualTo(UPDATED_LIBELLE);
        assertThat(testCaisse.getDateCreationCaisse()).isEqualTo(UPDATED_DATE_CREATION_CAISSE);
        assertThat(testCaisse.getDateFermiture()).isEqualTo(UPDATED_DATE_FERMITURE);
        assertThat(testCaisse.getSolde()).isEqualTo(UPDATED_SOLDE);
        assertThat(testCaisse.getEtat()).isEqualTo(UPDATED_ETAT);
        assertThat(testCaisse.getDateHeureModification()).isEqualTo(UPDATED_DATE_HEURE_MODIFICATION);
        assertThat(testCaisse.getDateHeureCreation()).isEqualTo(UPDATED_DATE_HEURE_CREATION);
        assertThat(testCaisse.getUtiCree()).isEqualTo(UPDATED_UTI_CREE);
        assertThat(testCaisse.getUtiModifie()).isEqualTo(UPDATED_UTI_MODIFIE);
    }

    @Test
    @Transactional
    void putNonExistingCaisse() throws Exception {
        int databaseSizeBeforeUpdate = caisseRepository.findAll().size();
        caisse.setId(longCount.incrementAndGet());

        // Create the Caisse
        CaisseDTO caisseDTO = caisseMapper.toDto(caisse);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCaisseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, caisseDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(caisseDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Caisse in the database
        List<Caisse> caisseList = caisseRepository.findAll();
        assertThat(caisseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCaisse() throws Exception {
        int databaseSizeBeforeUpdate = caisseRepository.findAll().size();
        caisse.setId(longCount.incrementAndGet());

        // Create the Caisse
        CaisseDTO caisseDTO = caisseMapper.toDto(caisse);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCaisseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(caisseDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Caisse in the database
        List<Caisse> caisseList = caisseRepository.findAll();
        assertThat(caisseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCaisse() throws Exception {
        int databaseSizeBeforeUpdate = caisseRepository.findAll().size();
        caisse.setId(longCount.incrementAndGet());

        // Create the Caisse
        CaisseDTO caisseDTO = caisseMapper.toDto(caisse);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCaisseMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(caisseDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Caisse in the database
        List<Caisse> caisseList = caisseRepository.findAll();
        assertThat(caisseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCaisseWithPatch() throws Exception {
        // Initialize the database
        caisseRepository.saveAndFlush(caisse);

        int databaseSizeBeforeUpdate = caisseRepository.findAll().size();

        // Update the caisse using partial update
        Caisse partialUpdatedCaisse = new Caisse();
        partialUpdatedCaisse.setId(caisse.getId());

        partialUpdatedCaisse
            .dateCreationCaisse(UPDATED_DATE_CREATION_CAISSE)
            .solde(UPDATED_SOLDE)
            .dateHeureCreation(UPDATED_DATE_HEURE_CREATION);

        restCaisseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCaisse.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCaisse))
            )
            .andExpect(status().isOk());

        // Validate the Caisse in the database
        List<Caisse> caisseList = caisseRepository.findAll();
        assertThat(caisseList).hasSize(databaseSizeBeforeUpdate);
        Caisse testCaisse = caisseList.get(caisseList.size() - 1);
        assertThat(testCaisse.getLibelle()).isEqualTo(DEFAULT_LIBELLE);
        assertThat(testCaisse.getDateCreationCaisse()).isEqualTo(UPDATED_DATE_CREATION_CAISSE);
        assertThat(testCaisse.getDateFermiture()).isEqualTo(DEFAULT_DATE_FERMITURE);
        assertThat(testCaisse.getSolde()).isEqualTo(UPDATED_SOLDE);
        assertThat(testCaisse.getEtat()).isEqualTo(DEFAULT_ETAT);
        assertThat(testCaisse.getDateHeureModification()).isEqualTo(DEFAULT_DATE_HEURE_MODIFICATION);
        assertThat(testCaisse.getDateHeureCreation()).isEqualTo(UPDATED_DATE_HEURE_CREATION);
        assertThat(testCaisse.getUtiCree()).isEqualTo(DEFAULT_UTI_CREE);
        assertThat(testCaisse.getUtiModifie()).isEqualTo(DEFAULT_UTI_MODIFIE);
    }

    @Test
    @Transactional
    void fullUpdateCaisseWithPatch() throws Exception {
        // Initialize the database
        caisseRepository.saveAndFlush(caisse);

        int databaseSizeBeforeUpdate = caisseRepository.findAll().size();

        // Update the caisse using partial update
        Caisse partialUpdatedCaisse = new Caisse();
        partialUpdatedCaisse.setId(caisse.getId());

        partialUpdatedCaisse
            .libelle(UPDATED_LIBELLE)
            .dateCreationCaisse(UPDATED_DATE_CREATION_CAISSE)
            .dateFermiture(UPDATED_DATE_FERMITURE)
            .solde(UPDATED_SOLDE)
            .etat(UPDATED_ETAT)
            .dateHeureModification(UPDATED_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(UPDATED_DATE_HEURE_CREATION)
            .utiCree(UPDATED_UTI_CREE)
            .utiModifie(UPDATED_UTI_MODIFIE);

        restCaisseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCaisse.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCaisse))
            )
            .andExpect(status().isOk());

        // Validate the Caisse in the database
        List<Caisse> caisseList = caisseRepository.findAll();
        assertThat(caisseList).hasSize(databaseSizeBeforeUpdate);
        Caisse testCaisse = caisseList.get(caisseList.size() - 1);
        assertThat(testCaisse.getLibelle()).isEqualTo(UPDATED_LIBELLE);
        assertThat(testCaisse.getDateCreationCaisse()).isEqualTo(UPDATED_DATE_CREATION_CAISSE);
        assertThat(testCaisse.getDateFermiture()).isEqualTo(UPDATED_DATE_FERMITURE);
        assertThat(testCaisse.getSolde()).isEqualTo(UPDATED_SOLDE);
        assertThat(testCaisse.getEtat()).isEqualTo(UPDATED_ETAT);
        assertThat(testCaisse.getDateHeureModification()).isEqualTo(UPDATED_DATE_HEURE_MODIFICATION);
        assertThat(testCaisse.getDateHeureCreation()).isEqualTo(UPDATED_DATE_HEURE_CREATION);
        assertThat(testCaisse.getUtiCree()).isEqualTo(UPDATED_UTI_CREE);
        assertThat(testCaisse.getUtiModifie()).isEqualTo(UPDATED_UTI_MODIFIE);
    }

    @Test
    @Transactional
    void patchNonExistingCaisse() throws Exception {
        int databaseSizeBeforeUpdate = caisseRepository.findAll().size();
        caisse.setId(longCount.incrementAndGet());

        // Create the Caisse
        CaisseDTO caisseDTO = caisseMapper.toDto(caisse);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCaisseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, caisseDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(caisseDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Caisse in the database
        List<Caisse> caisseList = caisseRepository.findAll();
        assertThat(caisseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCaisse() throws Exception {
        int databaseSizeBeforeUpdate = caisseRepository.findAll().size();
        caisse.setId(longCount.incrementAndGet());

        // Create the Caisse
        CaisseDTO caisseDTO = caisseMapper.toDto(caisse);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCaisseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(caisseDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Caisse in the database
        List<Caisse> caisseList = caisseRepository.findAll();
        assertThat(caisseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCaisse() throws Exception {
        int databaseSizeBeforeUpdate = caisseRepository.findAll().size();
        caisse.setId(longCount.incrementAndGet());

        // Create the Caisse
        CaisseDTO caisseDTO = caisseMapper.toDto(caisse);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCaisseMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(caisseDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Caisse in the database
        List<Caisse> caisseList = caisseRepository.findAll();
        assertThat(caisseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCaisse() throws Exception {
        // Initialize the database
        caisseRepository.saveAndFlush(caisse);

        int databaseSizeBeforeDelete = caisseRepository.findAll().size();

        // Delete the caisse
        restCaisseMockMvc
            .perform(delete(ENTITY_API_URL_ID, caisse.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Caisse> caisseList = caisseRepository.findAll();
        assertThat(caisseList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
