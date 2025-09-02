package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.Agent;
import com.mycompany.myapp.domain.AgentEtatProfil;
import com.mycompany.myapp.domain.Etablissement;
import com.mycompany.myapp.service.dto.AgentDTO;
import com.mycompany.myapp.service.dto.AgentEtatProfilDTO;
import com.mycompany.myapp.service.dto.EtablissementDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link AgentEtatProfil} and its DTO {@link AgentEtatProfilDTO}.
 */
@Mapper(componentModel = "spring")
public interface AgentEtatProfilMapper extends EntityMapper<AgentEtatProfilDTO, AgentEtatProfil> {
    @Mapping(target = "agent", source = "agent", qualifiedByName = "agentId")
    @Mapping(target = "etablissement", source = "etablissement", qualifiedByName = "etablissementId")
    AgentEtatProfilDTO toDto(AgentEtatProfil s);

    @Named("agentId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    AgentDTO toDtoAgentId(Agent agent);

    @Named("etablissementId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    EtablissementDTO toDtoEtablissementId(Etablissement etablissement);
}
