package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.Caisse;
import com.mycompany.myapp.domain.CaisseRubrique;
import com.mycompany.myapp.domain.Rubrique;
import com.mycompany.myapp.service.dto.CaisseDTO;
import com.mycompany.myapp.service.dto.CaisseRubriqueDTO;
import com.mycompany.myapp.service.dto.RubriqueDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link CaisseRubrique} and its DTO {@link CaisseRubriqueDTO}.
 */
@Mapper(componentModel = "spring")
public interface CaisseRubriqueMapper extends EntityMapper<CaisseRubriqueDTO, CaisseRubrique> {
    @Mapping(target = "caisse", source = "caisse", qualifiedByName = "caisseId")
    @Mapping(target = "rubrique", source = "rubrique", qualifiedByName = "rubriqueId")
    CaisseRubriqueDTO toDto(CaisseRubrique s);

    @Named("caisseId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    CaisseDTO toDtoCaisseId(Caisse caisse);

    @Named("rubriqueId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    RubriqueDTO toDtoRubriqueId(Rubrique rubrique);
}
