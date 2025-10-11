package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Caisse;
import com.mycompany.myapp.domain.ModeOperation;
import com.mycompany.myapp.domain.Operation;
import com.mycompany.myapp.domain.TypeOperation;
import com.mycompany.myapp.domain.enumeration.EtatCaisse;
import com.mycompany.myapp.repository.CaisseRepository;
import com.mycompany.myapp.repository.ModeOperationRepository;
import com.mycompany.myapp.repository.OperationRepository;
import com.mycompany.myapp.repository.TypeOperationRepository;
import com.mycompany.myapp.service.CaisseService;
import com.mycompany.myapp.service.OperationService;
import com.mycompany.myapp.service.dto.CaisseDTO;
import com.mycompany.myapp.service.dto.OperationDTO;
import com.mycompany.myapp.service.mapper.OperationMapper;
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
 * Service Implementation for managing {@link com.mycompany.myapp.domain.Operation}.
 */
@Service
@Transactional
public class OperationServiceImpl implements OperationService {

    private final Logger log = LoggerFactory.getLogger(OperationServiceImpl.class);

    private final OperationRepository operationRepository;

    private final OperationMapper operationMapper;

    private final CaisseService caisseService;

    private final TypeOperationRepository typeOperationRepository;

    private final ModeOperationRepository modeOperationRepository;

    private final CaisseRepository caisseRepository;

    public OperationServiceImpl(
        OperationRepository operationRepository,
        OperationMapper operationMapper,
        CaisseService caisseService,
        TypeOperationRepository typeOperationRepository,
        ModeOperationRepository modeOperationRepository,
        CaisseRepository caisseRepository
    ) {
        this.operationRepository = operationRepository;
        this.operationMapper = operationMapper;
        this.caisseService = caisseService;
        this.typeOperationRepository = typeOperationRepository;
        this.modeOperationRepository = modeOperationRepository;
        this.caisseRepository = caisseRepository;
    }

    @Transactional
    public Operation effectuerDepense(OperationDTO operationDTO) {
        Long caisseId = operationDTO.getCaisse().getId();
        Long montant = operationDTO.getMontant();
        Long modeOperationId = operationDTO.getModeOperation().getId();
        // 1️⃣ Récupérer la caisse (entité)
        Caisse caisse = caisseRepository
            .findById(caisseId)
            .orElseThrow(() -> new RuntimeException("Caisse non trouvée pour l'ID : " + caisseId));

        if (caisse.getEtat() != EtatCaisse.OUVERTE) {
            throw new IllegalStateException("Impossible de faire une dépense : la caisse est fermée");
        }
        // 2️⃣ Vérifier les conditions
        if (montant <= 0) {
            throw new RuntimeException("Le montant de la dépense doit être supérieur à 0");
        }

        if (montant > 200_000L) {
            throw new RuntimeException("Le montant maximal pour une dépense est de 200 000");
        }

        if (caisse.getSolde() < montant) {
            throw new RuntimeException("Solde insuffisant dans la caisse");
        }

        // 3️⃣ Récupérer le mode d'opération
        ModeOperation modeOperation = modeOperationRepository
            .findById(modeOperationId)
            .orElseThrow(() -> new RuntimeException("Mode d'opération introuvable"));

        // 4️⃣ Récupérer le type DEBIT
        TypeOperation debit = typeOperationRepository
            .findByLibelle("DEBIT")
            .orElseThrow(() -> new RuntimeException("Type DEBIT non trouvé"));

        // 5️⃣ Créer l'opération
        Operation operation = operationMapper.toEntity(operationDTO);
        //Générer un numéro unique (exemple simple, à améliorer si besoin)
        String numero = "OP-" + System.currentTimeMillis();
        operation.setNumero(numero);
        operation.setDateHeureCreation(Instant.now());
        operation.setDateHeureModification(Instant.now());
        operation.setDateOperation(Instant.now());
        operation.setTypeOperation(debit);

        // 6️⃣ Mettre à jour le solde de la caisse
        caisse.setSolde(caisse.getSolde() - montant);
        caisseRepository.save(caisse);

        // 7️⃣ Sauvegarder l'opération
        return operationRepository.save(operation);
    }

    @Transactional(readOnly = true)
    public List<OperationDTO> findByCaisse(Long caisseId) {
        return operationRepository.findByCaisseId(caisseId).stream().map(operationMapper::toDto).toList();
    }

    @Transactional(readOnly = true)
    public List<OperationDTO> findDepensesByCaisse(Long caisseId) {
        return operationRepository.findByCaisseIdAndTypeOperationLibelle(caisseId, "DEBIT").stream().map(operationMapper::toDto).toList();
    }

    @Override
    public OperationDTO save(OperationDTO operationDTO) {
        log.debug("Request to save Operation : {}", operationDTO);
        Operation operation = operationMapper.toEntity(operationDTO);
        operation = operationRepository.save(operation);
        return operationMapper.toDto(operation);
    }

    @Override
    public OperationDTO update(OperationDTO operationDTO) {
        log.debug("Request to update Operation : {}", operationDTO);
        Operation operation = operationMapper.toEntity(operationDTO);
        operation = operationRepository.save(operation);
        return operationMapper.toDto(operation);
    }

    @Override
    public Optional<OperationDTO> partialUpdate(OperationDTO operationDTO) {
        log.debug("Request to partially update Operation : {}", operationDTO);

        return operationRepository
            .findById(operationDTO.getId())
            .map(existingOperation -> {
                operationMapper.partialUpdate(existingOperation, operationDTO);

                return existingOperation;
            })
            .map(operationRepository::save)
            .map(operationMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OperationDTO> findAll() {
        log.debug("Request to get all Operations");
        return operationRepository.findAll().stream().map(operationMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<OperationDTO> findOne(Long id) {
        log.debug("Request to get Operation : {}", id);
        return operationRepository.findById(id).map(operationMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Operation : {}", id);
        operationRepository.deleteById(id);
    }
}
