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

    @Mapping(target = "caisse", source = "caisse.id", qualifiedByName = "caisseFromId")
    @Mapping(target = "rubrique", source = "rubrique.id", qualifiedByName = "rubriqueFromId")
    CaisseRubrique toEntity(CaisseRubriqueDTO dto);

    @Named("caisseId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "libelle", source = "libelle")
    CaisseDTO toDtoCaisseId(Caisse caisse);

    @Named("rubriqueId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "libelle", source = "libelle")
    RubriqueDTO toDtoRubriqueId(Rubrique rubrique);

    @Named("caisseFromId")
    default Caisse fromIdCaisse(Long id) {
        if (id == null) return null;
        Caisse caisse = new Caisse();
        caisse.setId(id);
        return caisse;
    }

    @Named("rubriqueFromId")
    default Rubrique fromIdRubrique(Long id) {
        if (id == null) return null;
        Rubrique rubrique = new Rubrique();
        rubrique.setId(id);
        return rubrique;
    }
}
