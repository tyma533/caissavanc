package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.Demande;
import com.mycompany.myapp.domain.Etablissement;
import com.mycompany.myapp.service.dto.DemandeDTO;
import com.mycompany.myapp.service.dto.EtablissementDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Demande} and its DTO {@link DemandeDTO}.
 */
@Mapper(componentModel = "spring")
public interface DemandeMapper extends EntityMapper<DemandeDTO, Demande> {
    @Mapping(target = "etablissement", source = "etablissement", qualifiedByName = "etablissementId")
    DemandeDTO toDto(Demande s);

    @Named("etablissementId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    EtablissementDTO toDtoEtablissementId(Etablissement etablissement);
}
