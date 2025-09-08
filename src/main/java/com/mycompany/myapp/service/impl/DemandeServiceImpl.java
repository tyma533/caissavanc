package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Demande;
import com.mycompany.myapp.domain.enumeration.EtatCaisse;
import com.mycompany.myapp.domain.enumeration.Objet;
import com.mycompany.myapp.repository.DemandeRepository;
import com.mycompany.myapp.service.CaisseService;
import com.mycompany.myapp.service.DemandeService;
import com.mycompany.myapp.service.dto.CaisseDTO;
import com.mycompany.myapp.service.dto.DemandeDTO;
import com.mycompany.myapp.service.mapper.DemandeMapper;
import jakarta.persistence.EntityNotFoundException;
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

    public DemandeServiceImpl(DemandeRepository demandeRepository, DemandeMapper demandeMapper, CaisseService caisseService) {
        this.demandeRepository = demandeRepository;
        this.demandeMapper = demandeMapper;
        this.caisseService = caisseService;
    }

    @Override
    public DemandeDTO traiterDemande(Long id, boolean accepte, String motifRefus) {
        Optional<Demande> demandeOpt = demandeRepository.findById(id);
        if (demandeOpt.isEmpty()) {
            throw new RuntimeException("Demande non trouvée");
        }
        Demande demande = demandeOpt.get();

        if (!accepte) {
            demande.setMotif(motifRefus);
            // ...autres champs pour refus...
        } else {
            if (demande.getObjet() == Objet.CREATION_CAISSE && demande.getEtablissement() != null) {
                List<CaisseDTO> caisses = caisseService
                    .findAll()
                    .stream()
                    .filter(c ->
                        c.getEtablissement() != null &&
                        c.getEtablissement().getId().equals(demande.getEtablissement().getId()) &&
                        c.getLibelle() != null &&
                        c.getLibelle().equalsIgnoreCase(demande.getLibelle())
                    )
                    .toList();
                if (caisses.isEmpty()) {
                    CaisseDTO caisse = new CaisseDTO();
                    caisse.setLibelle(demande.getLibelle());
                    caisse.setDateCreationCaisse(Instant.now());
                    caisse.setSolde(0L);
                    caisse.setEtat(EtatCaisse.OUVERTE);
                    caisse.setEtablissement(demande.getEtablissement());
                    caisseService.save(caisse);
                } else {
                    throw new RuntimeException("Une caisse avec ce libellé existe déjà pour cet établissement");
                }
            }
            // if (demande.getObjet() == Objet.ALIMENTATION_CAISSE && demande.getEtablissement() != null) {
            //     List<CaisseDTO> caisses = caisseService.findAll().stream()
            //         .filter(c -> c.getEtablissement() != null && c.getEtablissement().getId().equals(demande.getEtablissement().getId()))
            //         .toList();
            //     if (!caisses.isEmpty()) {
            //         CaisseDTO caisse = caisses.get(0);
            //         Long montant = demande.getMontant();
            //         caisse.setSolde(caisse.getSolde() + montant);
            //         caisseService.update(caisse);
            //              }
            // }
            if (demande.getObjet() == Objet.ALIMENTATION_CAISSE && demande.getCaisseId() != null && demande.getMontant() != null) {
                Optional<CaisseDTO> caisseOpt = caisseService.findOne(demande.getCaisseId());
                if (caisseOpt.isPresent()) {
                    CaisseDTO caisse = caisseOpt.get();
                    caisse.setSolde(caisse.getSolde() + demande.getMontant());
                    caisseService.update(caisse);
                }
            }
        }
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
