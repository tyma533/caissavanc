package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Caisse;
import com.mycompany.myapp.domain.CaisseRubrique;
import com.mycompany.myapp.domain.Rubrique;
import com.mycompany.myapp.repository.CaisseRepository;
import com.mycompany.myapp.repository.CaisseRubriqueRepository;
import com.mycompany.myapp.repository.RubriqueRepository;
import com.mycompany.myapp.service.CaisseService;
import com.mycompany.myapp.service.dto.CaisseDTO;
import com.mycompany.myapp.service.dto.CaisseRubriqueDTO;
import com.mycompany.myapp.service.dto.RubriqueDTO;
import com.mycompany.myapp.service.mapper.CaisseMapper;
import com.mycompany.myapp.service.mapper.CaisseRubriqueMapper;
import com.mycompany.myapp.service.mapper.RubriqueMapper;
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
 * Service Implementation for managing {@link com.mycompany.myapp.domain.Caisse}.
 */
@Service
@Transactional
public class CaisseServiceImpl implements CaisseService {

    private final Logger log = LoggerFactory.getLogger(CaisseServiceImpl.class);

    private final CaisseRepository caisseRepository;

    private final CaisseMapper caisseMapper;

    private final RubriqueRepository rubriqueRepository;

    private final CaisseRubriqueRepository caisseRubriqueRepository;
    private final CaisseRubriqueMapper caisseRubriqueMapper;

    private final RubriqueMapper rubriqueMapper;

    public CaisseServiceImpl(
        CaisseRepository caisseRepository,
        CaisseMapper caisseMapper,
        RubriqueRepository rubriqueRepository,
        RubriqueMapper rubriqueMapper,
        CaisseRubriqueRepository caisseRubriqueRepository,
        CaisseRubriqueMapper caisseRubriqueMapper
    ) {
        this.caisseRepository = caisseRepository;
        this.caisseMapper = caisseMapper;
        this.rubriqueRepository = rubriqueRepository;
        this.rubriqueMapper = rubriqueMapper;
        this.caisseRubriqueRepository = caisseRubriqueRepository;
        this.caisseRubriqueMapper = caisseRubriqueMapper;
    }

    @Override
    public CaisseRubriqueDTO affecterRubriqueALaCaisse(Long caisseId, Long rubriqueId) {
        log.debug("Affectation de la rubrique {} à la caisse {}", rubriqueId, caisseId);

        // Création de l'entité CaisseRubrique
        CaisseRubrique caisseRubrique = new CaisseRubrique();

        // Associer la caisse et la rubrique uniquement par ID
        Caisse caisse = new Caisse();
        caisse.setId(caisseId);
        caisseRubrique.setCaisse(caisse);

        Rubrique rubrique = new Rubrique();
        rubrique.setId(rubriqueId);
        caisseRubrique.setRubrique(rubrique);

        // Remplir les dates de création et modification
        caisseRubrique.setDateHeureCreation(Instant.now());
        caisseRubrique.setDateHeureModification(Instant.now());

        // Sauvegarder
        caisseRubrique = caisseRubriqueRepository.save(caisseRubrique);

        return caisseRubriqueMapper.toDto(caisseRubrique);
    }

    //     @Override
    // public List<CaisseDTO> findAllFiltered(String libelle, String etablissementName) {
    //     return caisseRepository.findAll().stream()
    //         .filter(c -> libelle == null || c.getLibelle().toLowerCase().contains(libelle.toLowerCase()))
    //         .filter(c -> etablissementName == null ||
    //                      (c.getEtablissement() != null &&
    //                       c.getEtablissement().getLibelle().toLowerCase().contains(etablissementName.toLowerCase())))
    //         .map(caisseMapper::toDto)
    //         .collect(Collectors.toList());
    // }

    @Transactional(readOnly = true)
    public List<CaisseDTO> findAllFiltered(String libelle, String etablissement) {
        if ((libelle == null || libelle.isEmpty()) && (etablissement == null || etablissement.isEmpty())) {
            // aucun filtre → retourne tout
            return caisseRepository.findAll().stream().map(caisseMapper::toDto).toList();
        }

        return caisseRepository
            .findByLibelleContainingIgnoreCaseAndEtablissement_LibelleContainingIgnoreCase(
                libelle != null ? libelle : "",
                etablissement != null ? etablissement : ""
            )
            .stream()
            .map(caisseMapper::toDto)
            .toList();
    }

    @Override
    public CaisseDTO save(CaisseDTO caisseDTO) {
        log.debug("Request to save Caisse : {}", caisseDTO);
        Caisse caisse = caisseMapper.toEntity(caisseDTO);
        caisse = caisseRepository.save(caisse);
        return caisseMapper.toDto(caisse);
    }

    @Override
    public CaisseDTO update(CaisseDTO caisseDTO) {
        log.debug("Request to update Caisse : {}", caisseDTO);
        Caisse caisse = caisseMapper.toEntity(caisseDTO);
        caisse = caisseRepository.save(caisse);
        return caisseMapper.toDto(caisse);
    }

    @Override
    public Optional<CaisseDTO> partialUpdate(CaisseDTO caisseDTO) {
        log.debug("Request to partially update Caisse : {}", caisseDTO);

        return caisseRepository
            .findById(caisseDTO.getId())
            .map(existingCaisse -> {
                caisseMapper.partialUpdate(existingCaisse, caisseDTO);

                return existingCaisse;
            })
            .map(caisseRepository::save)
            .map(caisseMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CaisseDTO> findAll() {
        log.debug("Request to get all Caisses");
        return caisseRepository.findAll().stream().map(caisseMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<CaisseDTO> findOne(Long id) {
        log.debug("Request to get Caisse : {}", id);
        return caisseRepository.findById(id).map(caisseMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Caisse : {}", id);
        caisseRepository.deleteById(id);
    }

    @Override
    public void affecterRubrique(Long caisseId, Long rubriqueId) {
        Caisse caisse = caisseRepository.findById(caisseId).orElseThrow(() -> new RuntimeException("Caisse non trouvée"));

        Rubrique rubrique = rubriqueRepository.findById(rubriqueId).orElseThrow(() -> new RuntimeException("Rubrique non trouvée"));

        caisse.getRubriques().add(rubrique);
        caisseRepository.save(caisse);
    }

    @Override
    public void desaffecterRubrique(Long caisseId, Long rubriqueId) {
        Caisse caisse = caisseRepository.findById(caisseId).orElseThrow(() -> new RuntimeException("Caisse non trouvée"));

        Rubrique rubrique = rubriqueRepository.findById(rubriqueId).orElseThrow(() -> new RuntimeException("Rubrique non trouvée"));

        caisse.getRubriques().remove(rubrique);
        caisseRepository.save(caisse);
    }

    @Override
    public Optional<CaisseDTO> findOne(Object id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findOne'");
    }

    @Override
    public List<CaisseDTO> findByEtablissementId(Long etablissementId) {
        return caisseRepository.findByEtablissementId(etablissementId).stream().map(caisseMapper::toDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RubriqueDTO> getRubriquesAffectees(Long caisseId) {
        Caisse caisse = caisseRepository.findById(caisseId).orElseThrow(() -> new RuntimeException("Caisse non trouvée"));

        return caisse.getRubriques().stream().map(rubriqueMapper::toDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RubriqueDTO> getRubriquesNonAffectees(Long caisseId) {
        Caisse caisse = caisseRepository.findById(caisseId).orElseThrow(() -> new RuntimeException("Caisse non trouvée"));

        List<Rubrique> toutes = rubriqueRepository.findAll();
        List<Rubrique> affectees = caisse.getRubriques().stream().toList();

        return toutes.stream().filter(r -> !affectees.contains(r)).map(rubriqueMapper::toDto).toList();
    }
}
