package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Caisse;
import com.mycompany.myapp.repository.CaisseRepository;
import com.mycompany.myapp.service.CaisseService;
import com.mycompany.myapp.service.dto.CaisseDTO;
import com.mycompany.myapp.service.mapper.CaisseMapper;
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

    public CaisseServiceImpl(CaisseRepository caisseRepository, CaisseMapper caisseMapper) {
        this.caisseRepository = caisseRepository;
        this.caisseMapper = caisseMapper;
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
}
