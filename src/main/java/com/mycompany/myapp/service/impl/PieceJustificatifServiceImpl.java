package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.PieceJustificatif;
import com.mycompany.myapp.repository.PieceJustificatifRepository;
import com.mycompany.myapp.service.PieceJustificatifService;
import com.mycompany.myapp.service.dto.PieceJustificatifDTO;
import com.mycompany.myapp.service.mapper.PieceJustificatifMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.myapp.domain.PieceJustificatif}.
 */
@Service
@Transactional
public class PieceJustificatifServiceImpl implements PieceJustificatifService {

    private final Logger log = LoggerFactory.getLogger(PieceJustificatifServiceImpl.class);

    private final PieceJustificatifRepository pieceJustificatifRepository;

    private final PieceJustificatifMapper pieceJustificatifMapper;

    public PieceJustificatifServiceImpl(
        PieceJustificatifRepository pieceJustificatifRepository,
        PieceJustificatifMapper pieceJustificatifMapper
    ) {
        this.pieceJustificatifRepository = pieceJustificatifRepository;
        this.pieceJustificatifMapper = pieceJustificatifMapper;
    }

    @Override
    public PieceJustificatifDTO save(PieceJustificatifDTO pieceJustificatifDTO) {
        log.debug("Request to save PieceJustificatif : {}", pieceJustificatifDTO);
        PieceJustificatif pieceJustificatif = pieceJustificatifMapper.toEntity(pieceJustificatifDTO);
        pieceJustificatif = pieceJustificatifRepository.save(pieceJustificatif);
        return pieceJustificatifMapper.toDto(pieceJustificatif);
    }

    @Override
    public PieceJustificatifDTO update(PieceJustificatifDTO pieceJustificatifDTO) {
        log.debug("Request to update PieceJustificatif : {}", pieceJustificatifDTO);
        PieceJustificatif pieceJustificatif = pieceJustificatifMapper.toEntity(pieceJustificatifDTO);
        pieceJustificatif = pieceJustificatifRepository.save(pieceJustificatif);
        return pieceJustificatifMapper.toDto(pieceJustificatif);
    }

    @Override
    public Optional<PieceJustificatifDTO> partialUpdate(PieceJustificatifDTO pieceJustificatifDTO) {
        log.debug("Request to partially update PieceJustificatif : {}", pieceJustificatifDTO);

        return pieceJustificatifRepository
            .findById(pieceJustificatifDTO.getId())
            .map(existingPieceJustificatif -> {
                pieceJustificatifMapper.partialUpdate(existingPieceJustificatif, pieceJustificatifDTO);

                return existingPieceJustificatif;
            })
            .map(pieceJustificatifRepository::save)
            .map(pieceJustificatifMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PieceJustificatifDTO> findAll() {
        log.debug("Request to get all PieceJustificatifs");
        return pieceJustificatifRepository
            .findAll()
            .stream()
            .map(pieceJustificatifMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<PieceJustificatifDTO> findOne(Long id) {
        log.debug("Request to get PieceJustificatif : {}", id);
        return pieceJustificatifRepository.findById(id).map(pieceJustificatifMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete PieceJustificatif : {}", id);
        pieceJustificatifRepository.deleteById(id);
    }
}
