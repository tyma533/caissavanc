package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.ModeOperation;
import com.mycompany.myapp.repository.ModeOperationRepository;
import com.mycompany.myapp.service.ModeOperationService;
import com.mycompany.myapp.service.dto.ModeOperationDTO;
import com.mycompany.myapp.service.mapper.ModeOperationMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.myapp.domain.ModeOperation}.
 */
@Service
@Transactional
public class ModeOperationServiceImpl implements ModeOperationService {

    private final Logger log = LoggerFactory.getLogger(ModeOperationServiceImpl.class);

    private final ModeOperationRepository modeOperationRepository;

    private final ModeOperationMapper modeOperationMapper;

    public ModeOperationServiceImpl(ModeOperationRepository modeOperationRepository, ModeOperationMapper modeOperationMapper) {
        this.modeOperationRepository = modeOperationRepository;
        this.modeOperationMapper = modeOperationMapper;
    }

    @Override
    public ModeOperationDTO save(ModeOperationDTO modeOperationDTO) {
        log.debug("Request to save ModeOperation : {}", modeOperationDTO);
        ModeOperation modeOperation = modeOperationMapper.toEntity(modeOperationDTO);
        modeOperation = modeOperationRepository.save(modeOperation);
        return modeOperationMapper.toDto(modeOperation);
    }

    @Override
    public ModeOperationDTO update(ModeOperationDTO modeOperationDTO) {
        log.debug("Request to update ModeOperation : {}", modeOperationDTO);
        ModeOperation modeOperation = modeOperationMapper.toEntity(modeOperationDTO);
        modeOperation = modeOperationRepository.save(modeOperation);
        return modeOperationMapper.toDto(modeOperation);
    }

    @Override
    public Optional<ModeOperationDTO> partialUpdate(ModeOperationDTO modeOperationDTO) {
        log.debug("Request to partially update ModeOperation : {}", modeOperationDTO);

        return modeOperationRepository
            .findById(modeOperationDTO.getId())
            .map(existingModeOperation -> {
                modeOperationMapper.partialUpdate(existingModeOperation, modeOperationDTO);

                return existingModeOperation;
            })
            .map(modeOperationRepository::save)
            .map(modeOperationMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ModeOperationDTO> findAll() {
        log.debug("Request to get all ModeOperations");
        return modeOperationRepository.findAll().stream().map(modeOperationMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ModeOperationDTO> findOne(Long id) {
        log.debug("Request to get ModeOperation : {}", id);
        return modeOperationRepository.findById(id).map(modeOperationMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete ModeOperation : {}", id);
        modeOperationRepository.deleteById(id);
    }
}
