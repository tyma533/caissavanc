package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.EtatOperation;
import com.mycompany.myapp.repository.EtatOperationRepository;
import com.mycompany.myapp.service.EtatOperationService;
import com.mycompany.myapp.service.dto.EtatOperationDTO;
import com.mycompany.myapp.service.mapper.EtatOperationMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.myapp.domain.EtatOperation}.
 */
@Service
@Transactional
public class EtatOperationServiceImpl implements EtatOperationService {

    private final Logger log = LoggerFactory.getLogger(EtatOperationServiceImpl.class);

    private final EtatOperationRepository etatOperationRepository;

    private final EtatOperationMapper etatOperationMapper;

    public EtatOperationServiceImpl(EtatOperationRepository etatOperationRepository, EtatOperationMapper etatOperationMapper) {
        this.etatOperationRepository = etatOperationRepository;
        this.etatOperationMapper = etatOperationMapper;
    }

    @Override
    public EtatOperationDTO save(EtatOperationDTO etatOperationDTO) {
        log.debug("Request to save EtatOperation : {}", etatOperationDTO);
        EtatOperation etatOperation = etatOperationMapper.toEntity(etatOperationDTO);
        etatOperation = etatOperationRepository.save(etatOperation);
        return etatOperationMapper.toDto(etatOperation);
    }

    @Override
    public EtatOperationDTO update(EtatOperationDTO etatOperationDTO) {
        log.debug("Request to update EtatOperation : {}", etatOperationDTO);
        EtatOperation etatOperation = etatOperationMapper.toEntity(etatOperationDTO);
        etatOperation = etatOperationRepository.save(etatOperation);
        return etatOperationMapper.toDto(etatOperation);
    }

    @Override
    public Optional<EtatOperationDTO> partialUpdate(EtatOperationDTO etatOperationDTO) {
        log.debug("Request to partially update EtatOperation : {}", etatOperationDTO);

        return etatOperationRepository
            .findById(etatOperationDTO.getId())
            .map(existingEtatOperation -> {
                etatOperationMapper.partialUpdate(existingEtatOperation, etatOperationDTO);

                return existingEtatOperation;
            })
            .map(etatOperationRepository::save)
            .map(etatOperationMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EtatOperationDTO> findAll() {
        log.debug("Request to get all EtatOperations");
        return etatOperationRepository.findAll().stream().map(etatOperationMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<EtatOperationDTO> findOne(Long id) {
        log.debug("Request to get EtatOperation : {}", id);
        return etatOperationRepository.findById(id).map(etatOperationMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete EtatOperation : {}", id);
        etatOperationRepository.deleteById(id);
    }
}
