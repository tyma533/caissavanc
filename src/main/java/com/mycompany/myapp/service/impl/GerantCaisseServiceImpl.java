package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.GerantCaisse;
import com.mycompany.myapp.repository.GerantCaisseRepository;
import com.mycompany.myapp.service.GerantCaisseService;
import com.mycompany.myapp.service.dto.GerantCaisseDTO;
import com.mycompany.myapp.service.mapper.GerantCaisseMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.myapp.domain.GerantCaisse}.
 */
@Service
@Transactional
public class GerantCaisseServiceImpl implements GerantCaisseService {

    private final Logger log = LoggerFactory.getLogger(GerantCaisseServiceImpl.class);

    private final GerantCaisseRepository gerantCaisseRepository;

    private final GerantCaisseMapper gerantCaisseMapper;

    public GerantCaisseServiceImpl(GerantCaisseRepository gerantCaisseRepository, GerantCaisseMapper gerantCaisseMapper) {
        this.gerantCaisseRepository = gerantCaisseRepository;
        this.gerantCaisseMapper = gerantCaisseMapper;
    }

    @Override
    public GerantCaisseDTO save(GerantCaisseDTO gerantCaisseDTO) {
        log.debug("Request to save GerantCaisse : {}", gerantCaisseDTO);
        GerantCaisse gerantCaisse = gerantCaisseMapper.toEntity(gerantCaisseDTO);

        // Vérifier si on essaye d'activer un gérant
        if (Boolean.TRUE.equals(gerantCaisse.getActif())) {
            Optional<GerantCaisse> existingActive = gerantCaisseRepository.findFirstByCaisseIdAndActifTrue(
                gerantCaisse.getCaisse().getId()
            );

            if (existingActive.isPresent()) {
                throw new RuntimeException("Cette caisse a déjà un gérant actif !");
            }
        }
        gerantCaisse = gerantCaisseRepository.save(gerantCaisse);
        return gerantCaisseMapper.toDto(gerantCaisse);
    }

    @Override
    public GerantCaisseDTO update(GerantCaisseDTO gerantCaisseDTO) {
        log.debug("Request to update GerantCaisse : {}", gerantCaisseDTO);
        GerantCaisse gerantCaisse = gerantCaisseMapper.toEntity(gerantCaisseDTO);
        // Vérifier si on essaye d’activer un gérant
        if (Boolean.TRUE.equals(gerantCaisse.getActif())) {
            Optional<GerantCaisse> existingActive = gerantCaisseRepository.findFirstByCaisseIdAndActifTrue(
                gerantCaisse.getCaisse().getId()
            );

            if (existingActive.isPresent() && !existingActive.get().getId().equals(gerantCaisse.getId())) {
                throw new RuntimeException("Cette caisse a déjà un gérant actif !");
            }
        }

        gerantCaisse = gerantCaisseRepository.save(gerantCaisse);
        return gerantCaisseMapper.toDto(gerantCaisse);
    }

    @Override
    public Optional<GerantCaisseDTO> partialUpdate(GerantCaisseDTO gerantCaisseDTO) {
        log.debug("Request to partially update GerantCaisse : {}", gerantCaisseDTO);

        return gerantCaisseRepository
            .findById(gerantCaisseDTO.getId())
            .map(existingGerantCaisse -> {
                gerantCaisseMapper.partialUpdate(existingGerantCaisse, gerantCaisseDTO);

                return existingGerantCaisse;
            })
            .map(gerantCaisseRepository::save)
            .map(gerantCaisseMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<GerantCaisseDTO> findAll() {
        log.debug("Request to get all GerantCaisses");
        return gerantCaisseRepository.findAll().stream().map(gerantCaisseMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<GerantCaisseDTO> findOne(Long id) {
        log.debug("Request to get GerantCaisse : {}", id);
        return gerantCaisseRepository.findById(id).map(gerantCaisseMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete GerantCaisse : {}", id);
        gerantCaisseRepository.deleteById(id);
    }
}
