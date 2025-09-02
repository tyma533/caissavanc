package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.AgentEtatProfil;
import com.mycompany.myapp.domain.Gerant;
import com.mycompany.myapp.service.dto.AgentEtatProfilDTO;
import com.mycompany.myapp.service.dto.GerantDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Gerant} and its DTO {@link GerantDTO}.
 */
@Mapper(componentModel = "spring")
public interface GerantMapper extends EntityMapper<GerantDTO, Gerant> {
    @Mapping(target = "agentEtatProfil", source = "agentEtatProfil", qualifiedByName = "agentEtatProfilId")
    GerantDTO toDto(Gerant s);

    @Named("agentEtatProfilId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    AgentEtatProfilDTO toDtoAgentEtatProfilId(AgentEtatProfil agentEtatProfil);
}
