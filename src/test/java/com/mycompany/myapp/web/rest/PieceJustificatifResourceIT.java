package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.PieceJustificatif;
import com.mycompany.myapp.repository.PieceJustificatifRepository;
import com.mycompany.myapp.service.dto.PieceJustificatifDTO;
import com.mycompany.myapp.service.mapper.PieceJustificatifMapper;
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
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link PieceJustificatifResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PieceJustificatifResourceIT {

    private static final String DEFAULT_LIBELLE = "AAAAAAAAAA";
    private static final String UPDATED_LIBELLE = "BBBBBBBBBB";

    private static final byte[] DEFAULT_PIECE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_PIECE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_PIECE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_PIECE_CONTENT_TYPE = "image/png";

    private static final Instant DEFAULT_DATE_HEURE_MODIFICATION = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_HEURE_MODIFICATION = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_DATE_HEURE_CREATION = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_HEURE_CREATION = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Long DEFAULT_UTI_CREE = 1L;
    private static final Long UPDATED_UTI_CREE = 2L;

    private static final Long DEFAULT_UTI_MODIFIE = 1L;
    private static final Long UPDATED_UTI_MODIFIE = 2L;

    private static final String ENTITY_API_URL = "/api/piece-justificatifs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PieceJustificatifRepository pieceJustificatifRepository;

    @Autowired
    private PieceJustificatifMapper pieceJustificatifMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPieceJustificatifMockMvc;

    private PieceJustificatif pieceJustificatif;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PieceJustificatif createEntity(EntityManager em) {
        PieceJustificatif pieceJustificatif = new PieceJustificatif()
            .libelle(DEFAULT_LIBELLE)
            .piece(DEFAULT_PIECE)
            .pieceContentType(DEFAULT_PIECE_CONTENT_TYPE)
            .dateHeureModification(DEFAULT_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(DEFAULT_DATE_HEURE_CREATION)
            .utiCree(DEFAULT_UTI_CREE)
            .utiModifie(DEFAULT_UTI_MODIFIE);
        return pieceJustificatif;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PieceJustificatif createUpdatedEntity(EntityManager em) {
        PieceJustificatif pieceJustificatif = new PieceJustificatif()
            .libelle(UPDATED_LIBELLE)
            .piece(UPDATED_PIECE)
            .pieceContentType(UPDATED_PIECE_CONTENT_TYPE)
            .dateHeureModification(UPDATED_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(UPDATED_DATE_HEURE_CREATION)
            .utiCree(UPDATED_UTI_CREE)
            .utiModifie(UPDATED_UTI_MODIFIE);
        return pieceJustificatif;
    }

    @BeforeEach
    public void initTest() {
        pieceJustificatif = createEntity(em);
    }

    @Test
    @Transactional
    void createPieceJustificatif() throws Exception {
        int databaseSizeBeforeCreate = pieceJustificatifRepository.findAll().size();
        // Create the PieceJustificatif
        PieceJustificatifDTO pieceJustificatifDTO = pieceJustificatifMapper.toDto(pieceJustificatif);
        restPieceJustificatifMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(pieceJustificatifDTO))
            )
            .andExpect(status().isCreated());

        // Validate the PieceJustificatif in the database
        List<PieceJustificatif> pieceJustificatifList = pieceJustificatifRepository.findAll();
        assertThat(pieceJustificatifList).hasSize(databaseSizeBeforeCreate + 1);
        PieceJustificatif testPieceJustificatif = pieceJustificatifList.get(pieceJustificatifList.size() - 1);
        assertThat(testPieceJustificatif.getLibelle()).isEqualTo(DEFAULT_LIBELLE);
        assertThat(testPieceJustificatif.getPiece()).isEqualTo(DEFAULT_PIECE);
        assertThat(testPieceJustificatif.getPieceContentType()).isEqualTo(DEFAULT_PIECE_CONTENT_TYPE);
        assertThat(testPieceJustificatif.getDateHeureModification()).isEqualTo(DEFAULT_DATE_HEURE_MODIFICATION);
        assertThat(testPieceJustificatif.getDateHeureCreation()).isEqualTo(DEFAULT_DATE_HEURE_CREATION);
        assertThat(testPieceJustificatif.getUtiCree()).isEqualTo(DEFAULT_UTI_CREE);
        assertThat(testPieceJustificatif.getUtiModifie()).isEqualTo(DEFAULT_UTI_MODIFIE);
    }

    @Test
    @Transactional
    void createPieceJustificatifWithExistingId() throws Exception {
        // Create the PieceJustificatif with an existing ID
        pieceJustificatif.setId(1L);
        PieceJustificatifDTO pieceJustificatifDTO = pieceJustificatifMapper.toDto(pieceJustificatif);

        int databaseSizeBeforeCreate = pieceJustificatifRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPieceJustificatifMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(pieceJustificatifDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the PieceJustificatif in the database
        List<PieceJustificatif> pieceJustificatifList = pieceJustificatifRepository.findAll();
        assertThat(pieceJustificatifList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPieceJustificatifs() throws Exception {
        // Initialize the database
        pieceJustificatifRepository.saveAndFlush(pieceJustificatif);

        // Get all the pieceJustificatifList
        restPieceJustificatifMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(pieceJustificatif.getId().intValue())))
            .andExpect(jsonPath("$.[*].libelle").value(hasItem(DEFAULT_LIBELLE)))
            .andExpect(jsonPath("$.[*].pieceContentType").value(hasItem(DEFAULT_PIECE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].piece").value(hasItem(Base64Utils.encodeToString(DEFAULT_PIECE))))
            .andExpect(jsonPath("$.[*].dateHeureModification").value(hasItem(DEFAULT_DATE_HEURE_MODIFICATION.toString())))
            .andExpect(jsonPath("$.[*].dateHeureCreation").value(hasItem(DEFAULT_DATE_HEURE_CREATION.toString())))
            .andExpect(jsonPath("$.[*].utiCree").value(hasItem(DEFAULT_UTI_CREE.intValue())))
            .andExpect(jsonPath("$.[*].utiModifie").value(hasItem(DEFAULT_UTI_MODIFIE.intValue())));
    }

    @Test
    @Transactional
    void getPieceJustificatif() throws Exception {
        // Initialize the database
        pieceJustificatifRepository.saveAndFlush(pieceJustificatif);

        // Get the pieceJustificatif
        restPieceJustificatifMockMvc
            .perform(get(ENTITY_API_URL_ID, pieceJustificatif.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(pieceJustificatif.getId().intValue()))
            .andExpect(jsonPath("$.libelle").value(DEFAULT_LIBELLE))
            .andExpect(jsonPath("$.pieceContentType").value(DEFAULT_PIECE_CONTENT_TYPE))
            .andExpect(jsonPath("$.piece").value(Base64Utils.encodeToString(DEFAULT_PIECE)))
            .andExpect(jsonPath("$.dateHeureModification").value(DEFAULT_DATE_HEURE_MODIFICATION.toString()))
            .andExpect(jsonPath("$.dateHeureCreation").value(DEFAULT_DATE_HEURE_CREATION.toString()))
            .andExpect(jsonPath("$.utiCree").value(DEFAULT_UTI_CREE.intValue()))
            .andExpect(jsonPath("$.utiModifie").value(DEFAULT_UTI_MODIFIE.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingPieceJustificatif() throws Exception {
        // Get the pieceJustificatif
        restPieceJustificatifMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPieceJustificatif() throws Exception {
        // Initialize the database
        pieceJustificatifRepository.saveAndFlush(pieceJustificatif);

        int databaseSizeBeforeUpdate = pieceJustificatifRepository.findAll().size();

        // Update the pieceJustificatif
        PieceJustificatif updatedPieceJustificatif = pieceJustificatifRepository.findById(pieceJustificatif.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedPieceJustificatif are not directly saved in db
        em.detach(updatedPieceJustificatif);
        updatedPieceJustificatif
            .libelle(UPDATED_LIBELLE)
            .piece(UPDATED_PIECE)
            .pieceContentType(UPDATED_PIECE_CONTENT_TYPE)
            .dateHeureModification(UPDATED_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(UPDATED_DATE_HEURE_CREATION)
            .utiCree(UPDATED_UTI_CREE)
            .utiModifie(UPDATED_UTI_MODIFIE);
        PieceJustificatifDTO pieceJustificatifDTO = pieceJustificatifMapper.toDto(updatedPieceJustificatif);

        restPieceJustificatifMockMvc
            .perform(
                put(ENTITY_API_URL_ID, pieceJustificatifDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(pieceJustificatifDTO))
            )
            .andExpect(status().isOk());

        // Validate the PieceJustificatif in the database
        List<PieceJustificatif> pieceJustificatifList = pieceJustificatifRepository.findAll();
        assertThat(pieceJustificatifList).hasSize(databaseSizeBeforeUpdate);
        PieceJustificatif testPieceJustificatif = pieceJustificatifList.get(pieceJustificatifList.size() - 1);
        assertThat(testPieceJustificatif.getLibelle()).isEqualTo(UPDATED_LIBELLE);
        assertThat(testPieceJustificatif.getPiece()).isEqualTo(UPDATED_PIECE);
        assertThat(testPieceJustificatif.getPieceContentType()).isEqualTo(UPDATED_PIECE_CONTENT_TYPE);
        assertThat(testPieceJustificatif.getDateHeureModification()).isEqualTo(UPDATED_DATE_HEURE_MODIFICATION);
        assertThat(testPieceJustificatif.getDateHeureCreation()).isEqualTo(UPDATED_DATE_HEURE_CREATION);
        assertThat(testPieceJustificatif.getUtiCree()).isEqualTo(UPDATED_UTI_CREE);
        assertThat(testPieceJustificatif.getUtiModifie()).isEqualTo(UPDATED_UTI_MODIFIE);
    }

    @Test
    @Transactional
    void putNonExistingPieceJustificatif() throws Exception {
        int databaseSizeBeforeUpdate = pieceJustificatifRepository.findAll().size();
        pieceJustificatif.setId(longCount.incrementAndGet());

        // Create the PieceJustificatif
        PieceJustificatifDTO pieceJustificatifDTO = pieceJustificatifMapper.toDto(pieceJustificatif);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPieceJustificatifMockMvc
            .perform(
                put(ENTITY_API_URL_ID, pieceJustificatifDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(pieceJustificatifDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the PieceJustificatif in the database
        List<PieceJustificatif> pieceJustificatifList = pieceJustificatifRepository.findAll();
        assertThat(pieceJustificatifList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPieceJustificatif() throws Exception {
        int databaseSizeBeforeUpdate = pieceJustificatifRepository.findAll().size();
        pieceJustificatif.setId(longCount.incrementAndGet());

        // Create the PieceJustificatif
        PieceJustificatifDTO pieceJustificatifDTO = pieceJustificatifMapper.toDto(pieceJustificatif);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPieceJustificatifMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(pieceJustificatifDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the PieceJustificatif in the database
        List<PieceJustificatif> pieceJustificatifList = pieceJustificatifRepository.findAll();
        assertThat(pieceJustificatifList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPieceJustificatif() throws Exception {
        int databaseSizeBeforeUpdate = pieceJustificatifRepository.findAll().size();
        pieceJustificatif.setId(longCount.incrementAndGet());

        // Create the PieceJustificatif
        PieceJustificatifDTO pieceJustificatifDTO = pieceJustificatifMapper.toDto(pieceJustificatif);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPieceJustificatifMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pieceJustificatifDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PieceJustificatif in the database
        List<PieceJustificatif> pieceJustificatifList = pieceJustificatifRepository.findAll();
        assertThat(pieceJustificatifList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePieceJustificatifWithPatch() throws Exception {
        // Initialize the database
        pieceJustificatifRepository.saveAndFlush(pieceJustificatif);

        int databaseSizeBeforeUpdate = pieceJustificatifRepository.findAll().size();

        // Update the pieceJustificatif using partial update
        PieceJustificatif partialUpdatedPieceJustificatif = new PieceJustificatif();
        partialUpdatedPieceJustificatif.setId(pieceJustificatif.getId());

        partialUpdatedPieceJustificatif
            .libelle(UPDATED_LIBELLE)
            .piece(UPDATED_PIECE)
            .pieceContentType(UPDATED_PIECE_CONTENT_TYPE)
            .dateHeureModification(UPDATED_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(UPDATED_DATE_HEURE_CREATION)
            .utiModifie(UPDATED_UTI_MODIFIE);

        restPieceJustificatifMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPieceJustificatif.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPieceJustificatif))
            )
            .andExpect(status().isOk());

        // Validate the PieceJustificatif in the database
        List<PieceJustificatif> pieceJustificatifList = pieceJustificatifRepository.findAll();
        assertThat(pieceJustificatifList).hasSize(databaseSizeBeforeUpdate);
        PieceJustificatif testPieceJustificatif = pieceJustificatifList.get(pieceJustificatifList.size() - 1);
        assertThat(testPieceJustificatif.getLibelle()).isEqualTo(UPDATED_LIBELLE);
        assertThat(testPieceJustificatif.getPiece()).isEqualTo(UPDATED_PIECE);
        assertThat(testPieceJustificatif.getPieceContentType()).isEqualTo(UPDATED_PIECE_CONTENT_TYPE);
        assertThat(testPieceJustificatif.getDateHeureModification()).isEqualTo(UPDATED_DATE_HEURE_MODIFICATION);
        assertThat(testPieceJustificatif.getDateHeureCreation()).isEqualTo(UPDATED_DATE_HEURE_CREATION);
        assertThat(testPieceJustificatif.getUtiCree()).isEqualTo(DEFAULT_UTI_CREE);
        assertThat(testPieceJustificatif.getUtiModifie()).isEqualTo(UPDATED_UTI_MODIFIE);
    }

    @Test
    @Transactional
    void fullUpdatePieceJustificatifWithPatch() throws Exception {
        // Initialize the database
        pieceJustificatifRepository.saveAndFlush(pieceJustificatif);

        int databaseSizeBeforeUpdate = pieceJustificatifRepository.findAll().size();

        // Update the pieceJustificatif using partial update
        PieceJustificatif partialUpdatedPieceJustificatif = new PieceJustificatif();
        partialUpdatedPieceJustificatif.setId(pieceJustificatif.getId());

        partialUpdatedPieceJustificatif
            .libelle(UPDATED_LIBELLE)
            .piece(UPDATED_PIECE)
            .pieceContentType(UPDATED_PIECE_CONTENT_TYPE)
            .dateHeureModification(UPDATED_DATE_HEURE_MODIFICATION)
            .dateHeureCreation(UPDATED_DATE_HEURE_CREATION)
            .utiCree(UPDATED_UTI_CREE)
            .utiModifie(UPDATED_UTI_MODIFIE);

        restPieceJustificatifMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPieceJustificatif.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPieceJustificatif))
            )
            .andExpect(status().isOk());

        // Validate the PieceJustificatif in the database
        List<PieceJustificatif> pieceJustificatifList = pieceJustificatifRepository.findAll();
        assertThat(pieceJustificatifList).hasSize(databaseSizeBeforeUpdate);
        PieceJustificatif testPieceJustificatif = pieceJustificatifList.get(pieceJustificatifList.size() - 1);
        assertThat(testPieceJustificatif.getLibelle()).isEqualTo(UPDATED_LIBELLE);
        assertThat(testPieceJustificatif.getPiece()).isEqualTo(UPDATED_PIECE);
        assertThat(testPieceJustificatif.getPieceContentType()).isEqualTo(UPDATED_PIECE_CONTENT_TYPE);
        assertThat(testPieceJustificatif.getDateHeureModification()).isEqualTo(UPDATED_DATE_HEURE_MODIFICATION);
        assertThat(testPieceJustificatif.getDateHeureCreation()).isEqualTo(UPDATED_DATE_HEURE_CREATION);
        assertThat(testPieceJustificatif.getUtiCree()).isEqualTo(UPDATED_UTI_CREE);
        assertThat(testPieceJustificatif.getUtiModifie()).isEqualTo(UPDATED_UTI_MODIFIE);
    }

    @Test
    @Transactional
    void patchNonExistingPieceJustificatif() throws Exception {
        int databaseSizeBeforeUpdate = pieceJustificatifRepository.findAll().size();
        pieceJustificatif.setId(longCount.incrementAndGet());

        // Create the PieceJustificatif
        PieceJustificatifDTO pieceJustificatifDTO = pieceJustificatifMapper.toDto(pieceJustificatif);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPieceJustificatifMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, pieceJustificatifDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(pieceJustificatifDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the PieceJustificatif in the database
        List<PieceJustificatif> pieceJustificatifList = pieceJustificatifRepository.findAll();
        assertThat(pieceJustificatifList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPieceJustificatif() throws Exception {
        int databaseSizeBeforeUpdate = pieceJustificatifRepository.findAll().size();
        pieceJustificatif.setId(longCount.incrementAndGet());

        // Create the PieceJustificatif
        PieceJustificatifDTO pieceJustificatifDTO = pieceJustificatifMapper.toDto(pieceJustificatif);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPieceJustificatifMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(pieceJustificatifDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the PieceJustificatif in the database
        List<PieceJustificatif> pieceJustificatifList = pieceJustificatifRepository.findAll();
        assertThat(pieceJustificatifList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPieceJustificatif() throws Exception {
        int databaseSizeBeforeUpdate = pieceJustificatifRepository.findAll().size();
        pieceJustificatif.setId(longCount.incrementAndGet());

        // Create the PieceJustificatif
        PieceJustificatifDTO pieceJustificatifDTO = pieceJustificatifMapper.toDto(pieceJustificatif);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPieceJustificatifMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(pieceJustificatifDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PieceJustificatif in the database
        List<PieceJustificatif> pieceJustificatifList = pieceJustificatifRepository.findAll();
        assertThat(pieceJustificatifList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePieceJustificatif() throws Exception {
        // Initialize the database
        pieceJustificatifRepository.saveAndFlush(pieceJustificatif);

        int databaseSizeBeforeDelete = pieceJustificatifRepository.findAll().size();

        // Delete the pieceJustificatif
        restPieceJustificatifMockMvc
            .perform(delete(ENTITY_API_URL_ID, pieceJustificatif.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<PieceJustificatif> pieceJustificatifList = pieceJustificatifRepository.findAll();
        assertThat(pieceJustificatifList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
