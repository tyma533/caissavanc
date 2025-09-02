package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.AgentEtatProfil;
import com.mycompany.myapp.repository.AgentEtatProfilRepository;
import com.mycompany.myapp.service.AgentEtatProfilService;
import com.mycompany.myapp.service.dto.AgentEtatProfilDTO;
import com.mycompany.myapp.service.mapper.AgentEtatProfilMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.myapp.domain.AgentEtatProfil}.
 */
@Service
@Transactional
public class AgentEtatProfilServiceImpl implements AgentEtatProfilService {

    private final Logger log = LoggerFactory.getLogger(AgentEtatProfilServiceImpl.class);

    private final AgentEtatProfilRepository agentEtatProfilRepository;

    private final AgentEtatProfilMapper agentEtatProfilMapper;

    public AgentEtatProfilServiceImpl(AgentEtatProfilRepository agentEtatProfilRepository, AgentEtatProfilMapper agentEtatProfilMapper) {
        this.agentEtatProfilRepository = agentEtatProfilRepository;
        this.agentEtatProfilMapper = agentEtatProfilMapper;
    }

    @Override
    public AgentEtatProfilDTO save(AgentEtatProfilDTO agentEtatProfilDTO) {
        log.debug("Request to save AgentEtatProfil : {}", agentEtatProfilDTO);
        AgentEtatProfil agentEtatProfil = agentEtatProfilMapper.toEntity(agentEtatProfilDTO);
        agentEtatProfil = agentEtatProfilRepository.save(agentEtatProfil);
        return agentEtatProfilMapper.toDto(agentEtatProfil);
    }

    @Override
    public AgentEtatProfilDTO update(AgentEtatProfilDTO agentEtatProfilDTO) {
        log.debug("Request to update AgentEtatProfil : {}", agentEtatProfilDTO);
        AgentEtatProfil agentEtatProfil = agentEtatProfilMapper.toEntity(agentEtatProfilDTO);
        agentEtatProfil = agentEtatProfilRepository.save(agentEtatProfil);
        return agentEtatProfilMapper.toDto(agentEtatProfil);
    }

    @Override
    public Optional<AgentEtatProfilDTO> partialUpdate(AgentEtatProfilDTO agentEtatProfilDTO) {
        log.debug("Request to partially update AgentEtatProfil : {}", agentEtatProfilDTO);

        return agentEtatProfilRepository
            .findById(agentEtatProfilDTO.getId())
            .map(existingAgentEtatProfil -> {
                agentEtatProfilMapper.partialUpdate(existingAgentEtatProfil, agentEtatProfilDTO);

                return existingAgentEtatProfil;
            })
            .map(agentEtatProfilRepository::save)
            .map(agentEtatProfilMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AgentEtatProfilDTO> findAll() {
        log.debug("Request to get all AgentEtatProfils");
        return agentEtatProfilRepository
            .findAll()
            .stream()
            .map(agentEtatProfilMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<AgentEtatProfilDTO> findOne(Long id) {
        log.debug("Request to get AgentEtatProfil : {}", id);
        return agentEtatProfilRepository.findById(id).map(agentEtatProfilMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete AgentEtatProfil : {}", id);
        agentEtatProfilRepository.deleteById(id);
    }
}
