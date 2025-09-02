package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.Caisse;
import com.mycompany.myapp.domain.Controle;
import com.mycompany.myapp.service.dto.CaisseDTO;
import com.mycompany.myapp.service.dto.ControleDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Controle} and its DTO {@link ControleDTO}.
 */
@Mapper(componentModel = "spring")
public interface ControleMapper extends EntityMapper<ControleDTO, Controle> {
    @Mapping(target = "caisse", source = "caisse", qualifiedByName = "caisseId")
    ControleDTO toDto(Controle s);

    @Named("caisseId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    CaisseDTO toDtoCaisseId(Caisse caisse);
}
