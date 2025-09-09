package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.Rubrique;
import com.mycompany.myapp.service.dto.RubriqueDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Rubrique} and its DTO {@link RubriqueDTO}.
 */
@Mapper(componentModel = "spring")
public interface RubriqueMapper extends EntityMapper<RubriqueDTO, Rubrique> {
    RubriqueDTO toDto(Rubrique rubrique);
    Rubrique toEntity(RubriqueDTO rubriqueDTO);
}
