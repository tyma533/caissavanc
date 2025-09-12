package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Demande;
import com.mycompany.myapp.domain.ModeOperation;
import com.mycompany.myapp.domain.Operation;
import com.mycompany.myapp.domain.TypeOperation;
import com.mycompany.myapp.domain.enumeration.EtatCaisse;
import com.mycompany.myapp.domain.enumeration.Objet;
import com.mycompany.myapp.repository.DemandeRepository;
import com.mycompany.myapp.repository.ModeOperationRepository;
import com.mycompany.myapp.repository.OperationRepository;
import com.mycompany.myapp.repository.TypeOperationRepository;
import com.mycompany.myapp.service.CaisseService;
import com.mycompany.myapp.service.DemandeService;
import com.mycompany.myapp.service.dto.CaisseDTO;
import com.mycompany.myapp.service.dto.DemandeDTO;
import com.mycompany.myapp.service.mapper.DemandeMapper;
import jakarta.persistence.EntityNotFoundException;
import java.lang.reflect.Type;
import java.time.Instant;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.myapp.domain.Demande}.
 */
@Service
@Transactional
public class DemandeServiceImpl implements DemandeService {

    private final Logger log = LoggerFactory.getLogger(DemandeServiceImpl.class);

    private final DemandeRepository demandeRepository;

    private final DemandeMapper demandeMapper;

    private final CaisseService caisseService;

    private final TypeOperationRepository typeOperationRepository;

    private final OperationRepository operationRepository;

    private final ModeOperationRepository modeOperationRepository;

    public DemandeServiceImpl(
        DemandeRepository demandeRepository,
        DemandeMapper demandeMapper,
        CaisseService caisseService,
        TypeOperationRepository typeOperationRepository,
        OperationRepository operationRepository,
        ModeOperationRepository modeOperationRepository
    ) {
        this.demandeRepository = demandeRepository;
        this.demandeMapper = demandeMapper;
        this.caisseService = caisseService;
        this.typeOperationRepository = typeOperationRepository;
        this.operationRepository = operationRepository;
        this.modeOperationRepository = modeOperationRepository;
    }

    private String generateNumeroOperation() {
        return "OP-" + Instant.now().toEpochMilli();
    }

    @Override
    public DemandeDTO traiterDemande(Long id, boolean accepte, String motifRefus, Long modeOperationId) {
        // Récupérer la demande
        Demande demande = demandeRepository.findById(id).orElseThrow(() -> new RuntimeException("Demande non trouvée pour l'ID : " + id));

        if (!accepte) {
            // Cas de refus
            demande.setMotif(motifRefus);
            // TODO : ajouter d'autres champs spécifiques au refus si nécessaire
        } else {
            // Cas d'acceptation
            switch (demande.getObjet()) {
                case CREATION_CAISSE -> {
                    if (demande.getEtablissement() == null) {
                        throw new RuntimeException("Etablissement manquant pour la création de caisse");
                    }

                    // Vérifier si une caisse avec ce libellé existe déjà
                    boolean exists = caisseService
                        .findAll()
                        .stream()
                        .anyMatch(c ->
                            c.getEtablissement() != null &&
                            c.getEtablissement().getId().equals(demande.getEtablissement().getId()) &&
                            c.getLibelle() != null &&
                            c.getLibelle().equalsIgnoreCase(demande.getLibelle())
                        );

                    if (exists) {
                        throw new RuntimeException("Une caisse avec ce libellé existe déjà pour cet établissement");
                    }

                    // Créer la caisse
                    CaisseDTO caisse = new CaisseDTO();
                    caisse.setLibelle(demande.getLibelle());
                    caisse.setDateCreationCaisse(Instant.now());
                    caisse.setSolde(0L);
                    caisse.setEtat(EtatCaisse.OUVERTE);
                    caisse.setEtablissement(demande.getEtablissement());
                    caisseService.save(caisse);
                }
                case ALIMENTATION_CAISSE -> {
                    if (demande.getCaisse() == null || demande.getMontant() == null) {
                        throw new RuntimeException("Caisse ou montant manquant pour l'alimentation");
                    }

                    // // Récupérer le mode d'opération depuis l'id fourni
                    // if (modeOperationId == null) {
                    //     throw new RuntimeException("Mode d'opération non renseigné pour l'alimentation");
                    // }
                    // demande.setModeOperation(
                    //     modeOperationRepository
                    //         .findById(modeOperationId)
                    //         .orElseThrow(() -> new RuntimeException("Mode d'opération introuvable"))
                    // );
                    // ⚡ assignation automatique du mode "VIREMENT"
                    ModeOperation virementMode = modeOperationRepository
                        .findByLibelle("VIREMENT")
                        .orElseThrow(() -> new RuntimeException("Mode d'opération VIREMENT introuvable"));
                    // ⚡ récupérer l'entité attachée
                    ModeOperation attachedMode = modeOperationRepository.getReferenceById(virementMode.getId());
                    demande.setModeOperation(virementMode);

                    // Mettre à jour le solde de la caisse
                    CaisseDTO caisse = caisseService
                        .findOne(demande.getCaisse().getId())
                        .orElseThrow(() -> new RuntimeException("Caisse non trouvée pour l'ID : " + demande.getCaisse().getId()));
                    caisse.setSolde(caisse.getSolde() + demande.getMontant());
                    caisseService.update(caisse);

                    // Assigner le type d'opération fixe à CREDIT
                    TypeOperation credit = typeOperationRepository
                        .findByLibelle("CREDIT")
                        .orElseThrow(() -> new RuntimeException("Type CREDIT non trouvé"));
                    demande.setTypeOperation(credit);

                    // Créer une opération correspondant à cette alimentation
                    Operation operation = new Operation();
                    operation.setCaisse(demande.getCaisse());
                    operation.setTypeOperation(credit);
                    operation.setModeOperation(demande.getModeOperation());
                    operation.setMontant(demande.getMontant());
                    operation.setDateOperation(Instant.now());
                    operation.setNumero(generateNumeroOperation()); // ou un compteur automatique
                    operation.setCommentaire("Alimentation de la caisse via virement");

                    operationRepository.save(operation);
                }
                default -> throw new RuntimeException("Objet de demande non géré : " + demande.getObjet());
            }
        }

        // Sauvegarder la demande et retourner le DTO
        demandeRepository.save(demande);
        return demandeMapper.toDto(demande);
    }

    @Override
    public DemandeDTO save(DemandeDTO demandeDTO) {
        log.debug("Request to save Demande : {}", demandeDTO);
        Demande demande = demandeMapper.toEntity(demandeDTO);
        demande = demandeRepository.save(demande);
        return demandeMapper.toDto(demande);
    }

    @Override
    public DemandeDTO update(DemandeDTO demandeDTO) {
        log.debug("Request to update Demande : {}", demandeDTO);
        Demande demande = demandeMapper.toEntity(demandeDTO);
        demande = demandeRepository.save(demande);
        return demandeMapper.toDto(demande);
    }

    @Override
    public Optional<DemandeDTO> partialUpdate(DemandeDTO demandeDTO) {
        log.debug("Request to partially update Demande : {}", demandeDTO);

        return demandeRepository
            .findById(demandeDTO.getId())
            .map(existingDemande -> {
                demandeMapper.partialUpdate(existingDemande, demandeDTO);

                return existingDemande;
            })
            .map(demandeRepository::save)
            .map(demandeMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DemandeDTO> findAll() {
        log.debug("Request to get all Demandes");
        return demandeRepository.findAll().stream().map(demandeMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<DemandeDTO> findOne(Long id) {
        log.debug("Request to get Demande : {}", id);
        return demandeRepository.findById(id).map(demandeMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Demande : {}", id);
        demandeRepository.deleteById(id);
    }
}
