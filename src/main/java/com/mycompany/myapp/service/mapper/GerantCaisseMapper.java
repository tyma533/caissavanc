package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.Caisse;
import com.mycompany.myapp.domain.Gerant;
import com.mycompany.myapp.domain.GerantCaisse;
import com.mycompany.myapp.service.dto.CaisseDTO;
import com.mycompany.myapp.service.dto.GerantCaisseDTO;
import com.mycompany.myapp.service.dto.GerantDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link GerantCaisse} and its DTO {@link GerantCaisseDTO}.
 */
@Mapper(componentModel = "spring")
public interface GerantCaisseMapper extends EntityMapper<GerantCaisseDTO, GerantCaisse> {
    @Mapping(target = "caisse", source = "caisse", qualifiedByName = "caisseId")
    @Mapping(target = "gerant", source = "gerant", qualifiedByName = "gerantId")
    GerantCaisseDTO toDto(GerantCaisse s);

    @Named("caisseId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    CaisseDTO toDtoCaisseId(Caisse caisse);

    @Named("gerantId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    GerantDTO toDtoGerantId(Gerant gerant);
}
