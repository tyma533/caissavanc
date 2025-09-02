package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Controle;
import com.mycompany.myapp.repository.ControleRepository;
import com.mycompany.myapp.service.ControleService;
import com.mycompany.myapp.service.dto.ControleDTO;
import com.mycompany.myapp.service.mapper.ControleMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.myapp.domain.Controle}.
 */
@Service
@Transactional
public class ControleServiceImpl implements ControleService {

    private final Logger log = LoggerFactory.getLogger(ControleServiceImpl.class);

    private final ControleRepository controleRepository;

    private final ControleMapper controleMapper;

    public ControleServiceImpl(ControleRepository controleRepository, ControleMapper controleMapper) {
        this.controleRepository = controleRepository;
        this.controleMapper = controleMapper;
    }

    @Override
    public ControleDTO save(ControleDTO controleDTO) {
        log.debug("Request to save Controle : {}", controleDTO);
        Controle controle = controleMapper.toEntity(controleDTO);
        controle = controleRepository.save(controle);
        return controleMapper.toDto(controle);
    }

    @Override
    public ControleDTO update(ControleDTO controleDTO) {
        log.debug("Request to update Controle : {}", controleDTO);
        Controle controle = controleMapper.toEntity(controleDTO);
        controle = controleRepository.save(controle);
        return controleMapper.toDto(controle);
    }

    @Override
    public Optional<ControleDTO> partialUpdate(ControleDTO controleDTO) {
        log.debug("Request to partially update Controle : {}", controleDTO);

        return controleRepository
            .findById(controleDTO.getId())
            .map(existingControle -> {
                controleMapper.partialUpdate(existingControle, controleDTO);

                return existingControle;
            })
            .map(controleRepository::save)
            .map(controleMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ControleDTO> findAll() {
        log.debug("Request to get all Controles");
        return controleRepository.findAll().stream().map(controleMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ControleDTO> findOne(Long id) {
        log.debug("Request to get Controle : {}", id);
        return controleRepository.findById(id).map(controleMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Controle : {}", id);
        controleRepository.deleteById(id);
    }
}
