package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Gerant;
import com.mycompany.myapp.repository.GerantRepository;
import com.mycompany.myapp.service.GerantService;
import com.mycompany.myapp.service.dto.GerantDTO;
import com.mycompany.myapp.service.mapper.GerantMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.myapp.domain.Gerant}.
 */
@Service
@Transactional
public class GerantServiceImpl implements GerantService {

    private final Logger log = LoggerFactory.getLogger(GerantServiceImpl.class);

    private final GerantRepository gerantRepository;

    private final GerantMapper gerantMapper;

    public GerantServiceImpl(GerantRepository gerantRepository, GerantMapper gerantMapper) {
        this.gerantRepository = gerantRepository;
        this.gerantMapper = gerantMapper;
    }

    @Override
    public GerantDTO save(GerantDTO gerantDTO) {
        log.debug("Request to save Gerant : {}", gerantDTO);
        Gerant gerant = gerantMapper.toEntity(gerantDTO);
        gerant = gerantRepository.save(gerant);
        return gerantMapper.toDto(gerant);
    }

    @Override
    public GerantDTO update(GerantDTO gerantDTO) {
        log.debug("Request to update Gerant : {}", gerantDTO);
        Gerant gerant = gerantMapper.toEntity(gerantDTO);
        gerant = gerantRepository.save(gerant);
        return gerantMapper.toDto(gerant);
    }

    @Override
    public Optional<GerantDTO> partialUpdate(GerantDTO gerantDTO) {
        log.debug("Request to partially update Gerant : {}", gerantDTO);

        return gerantRepository
            .findById(gerantDTO.getId())
            .map(existingGerant -> {
                gerantMapper.partialUpdate(existingGerant, gerantDTO);

                return existingGerant;
            })
            .map(gerantRepository::save)
            .map(gerantMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<GerantDTO> findAll() {
        log.debug("Request to get all Gerants");
        return gerantRepository.findAll().stream().map(gerantMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<GerantDTO> findOne(Long id) {
        log.debug("Request to get Gerant : {}", id);
        return gerantRepository.findById(id).map(gerantMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Gerant : {}", id);
        gerantRepository.deleteById(id);
    }
}
