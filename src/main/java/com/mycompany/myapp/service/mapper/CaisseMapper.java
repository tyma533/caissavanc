package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.Caisse;
import com.mycompany.myapp.domain.Etablissement;
import com.mycompany.myapp.service.dto.CaisseDTO;
import com.mycompany.myapp.service.dto.EtablissementDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Caisse} and its DTO {@link CaisseDTO}.
 */
@Mapper(componentModel = "spring")
public interface CaisseMapper extends EntityMapper<CaisseDTO, Caisse> {
    @Mapping(target = "etablissement", source = "etablissement", qualifiedByName = "etablissementId")
    CaisseDTO toDto(Caisse s);

    @Named("etablissementId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    EtablissementDTO toDtoEtablissementId(Etablissement etablissement);
}
