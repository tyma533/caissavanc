package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.CaisseRubrique;
import com.mycompany.myapp.repository.CaisseRubriqueRepository;
import com.mycompany.myapp.service.CaisseRubriqueService;
import com.mycompany.myapp.service.dto.CaisseRubriqueDTO;
import com.mycompany.myapp.service.mapper.CaisseRubriqueMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.myapp.domain.CaisseRubrique}.
 */
@Service
@Transactional
public class CaisseRubriqueServiceImpl implements CaisseRubriqueService {

    private final Logger log = LoggerFactory.getLogger(CaisseRubriqueServiceImpl.class);

    private final CaisseRubriqueRepository caisseRubriqueRepository;

    private final CaisseRubriqueMapper caisseRubriqueMapper;

    public CaisseRubriqueServiceImpl(CaisseRubriqueRepository caisseRubriqueRepository, CaisseRubriqueMapper caisseRubriqueMapper) {
        this.caisseRubriqueRepository = caisseRubriqueRepository;
        this.caisseRubriqueMapper = caisseRubriqueMapper;
    }

    @Override
    public CaisseRubriqueDTO save(CaisseRubriqueDTO caisseRubriqueDTO) {
        log.debug("Request to save CaisseRubrique : {}", caisseRubriqueDTO);
        CaisseRubrique caisseRubrique = caisseRubriqueMapper.toEntity(caisseRubriqueDTO);
        caisseRubrique = caisseRubriqueRepository.save(caisseRubrique);
        return caisseRubriqueMapper.toDto(caisseRubrique);
    }

    @Override
    public CaisseRubriqueDTO update(CaisseRubriqueDTO caisseRubriqueDTO) {
        log.debug("Request to update CaisseRubrique : {}", caisseRubriqueDTO);
        CaisseRubrique caisseRubrique = caisseRubriqueMapper.toEntity(caisseRubriqueDTO);
        caisseRubrique = caisseRubriqueRepository.save(caisseRubrique);
        return caisseRubriqueMapper.toDto(caisseRubrique);
    }

    @Override
    public Optional<CaisseRubriqueDTO> partialUpdate(CaisseRubriqueDTO caisseRubriqueDTO) {
        log.debug("Request to partially update CaisseRubrique : {}", caisseRubriqueDTO);

        return caisseRubriqueRepository
            .findById(caisseRubriqueDTO.getId())
            .map(existingCaisseRubrique -> {
                caisseRubriqueMapper.partialUpdate(existingCaisseRubrique, caisseRubriqueDTO);

                return existingCaisseRubrique;
            })
            .map(caisseRubriqueRepository::save)
            .map(caisseRubriqueMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CaisseRubriqueDTO> findAll() {
        log.debug("Request to get all CaisseRubriques");
        return caisseRubriqueRepository
            .findAll()
            .stream()
            .map(caisseRubriqueMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<CaisseRubriqueDTO> findOne(Long id) {
        log.debug("Request to get CaisseRubrique : {}", id);
        return caisseRubriqueRepository.findById(id).map(caisseRubriqueMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete CaisseRubrique : {}", id);
        caisseRubriqueRepository.deleteById(id);
    }
}
