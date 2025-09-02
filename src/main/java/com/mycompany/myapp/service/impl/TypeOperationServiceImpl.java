package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.TypeOperation;
import com.mycompany.myapp.repository.TypeOperationRepository;
import com.mycompany.myapp.service.TypeOperationService;
import com.mycompany.myapp.service.dto.TypeOperationDTO;
import com.mycompany.myapp.service.mapper.TypeOperationMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.myapp.domain.TypeOperation}.
 */
@Service
@Transactional
public class TypeOperationServiceImpl implements TypeOperationService {

    private final Logger log = LoggerFactory.getLogger(TypeOperationServiceImpl.class);

    private final TypeOperationRepository typeOperationRepository;

    private final TypeOperationMapper typeOperationMapper;

    public TypeOperationServiceImpl(TypeOperationRepository typeOperationRepository, TypeOperationMapper typeOperationMapper) {
        this.typeOperationRepository = typeOperationRepository;
        this.typeOperationMapper = typeOperationMapper;
    }

    @Override
    public TypeOperationDTO save(TypeOperationDTO typeOperationDTO) {
        log.debug("Request to save TypeOperation : {}", typeOperationDTO);
        TypeOperation typeOperation = typeOperationMapper.toEntity(typeOperationDTO);
        typeOperation = typeOperationRepository.save(typeOperation);
        return typeOperationMapper.toDto(typeOperation);
    }

    @Override
    public TypeOperationDTO update(TypeOperationDTO typeOperationDTO) {
        log.debug("Request to update TypeOperation : {}", typeOperationDTO);
        TypeOperation typeOperation = typeOperationMapper.toEntity(typeOperationDTO);
        typeOperation = typeOperationRepository.save(typeOperation);
        return typeOperationMapper.toDto(typeOperation);
    }

    @Override
    public Optional<TypeOperationDTO> partialUpdate(TypeOperationDTO typeOperationDTO) {
        log.debug("Request to partially update TypeOperation : {}", typeOperationDTO);

        return typeOperationRepository
            .findById(typeOperationDTO.getId())
            .map(existingTypeOperation -> {
                typeOperationMapper.partialUpdate(existingTypeOperation, typeOperationDTO);

                return existingTypeOperation;
            })
            .map(typeOperationRepository::save)
            .map(typeOperationMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TypeOperationDTO> findAll() {
        log.debug("Request to get all TypeOperations");
        return typeOperationRepository.findAll().stream().map(typeOperationMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<TypeOperationDTO> findOne(Long id) {
        log.debug("Request to get TypeOperation : {}", id);
        return typeOperationRepository.findById(id).map(typeOperationMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete TypeOperation : {}", id);
        typeOperationRepository.deleteById(id);
    }
}
