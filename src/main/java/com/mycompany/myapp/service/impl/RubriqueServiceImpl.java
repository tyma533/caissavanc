package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Rubrique;
import com.mycompany.myapp.repository.RubriqueRepository;
import com.mycompany.myapp.service.RubriqueService;
import com.mycompany.myapp.service.dto.RubriqueDTO;
import com.mycompany.myapp.service.mapper.RubriqueMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.myapp.domain.Rubrique}.
 */
@Service
@Transactional
public class RubriqueServiceImpl implements RubriqueService {

    private final Logger log = LoggerFactory.getLogger(RubriqueServiceImpl.class);

    private final RubriqueRepository rubriqueRepository;

    private final RubriqueMapper rubriqueMapper;

    public RubriqueServiceImpl(RubriqueRepository rubriqueRepository, RubriqueMapper rubriqueMapper) {
        this.rubriqueRepository = rubriqueRepository;
        this.rubriqueMapper = rubriqueMapper;
    }

    @Override
    public RubriqueDTO save(RubriqueDTO rubriqueDTO) {
        log.debug("Request to save Rubrique : {}", rubriqueDTO);
        Rubrique rubrique = rubriqueMapper.toEntity(rubriqueDTO);
        rubrique = rubriqueRepository.save(rubrique);
        return rubriqueMapper.toDto(rubrique);
    }

    @Override
    public RubriqueDTO update(RubriqueDTO rubriqueDTO) {
        log.debug("Request to update Rubrique : {}", rubriqueDTO);
        Rubrique rubrique = rubriqueMapper.toEntity(rubriqueDTO);
        rubrique = rubriqueRepository.save(rubrique);
        return rubriqueMapper.toDto(rubrique);
    }

    @Override
    public Optional<RubriqueDTO> partialUpdate(RubriqueDTO rubriqueDTO) {
        log.debug("Request to partially update Rubrique : {}", rubriqueDTO);

        return rubriqueRepository
            .findById(rubriqueDTO.getId())
            .map(existingRubrique -> {
                rubriqueMapper.partialUpdate(existingRubrique, rubriqueDTO);

                return existingRubrique;
            })
            .map(rubriqueRepository::save)
            .map(rubriqueMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RubriqueDTO> findAll() {
        log.debug("Request to get all Rubriques");
        return rubriqueRepository.findAll().stream().map(rubriqueMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<RubriqueDTO> findOne(Long id) {
        log.debug("Request to get Rubrique : {}", id);
        return rubriqueRepository.findById(id).map(rubriqueMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Rubrique : {}", id);
        rubriqueRepository.deleteById(id);
    }
}
