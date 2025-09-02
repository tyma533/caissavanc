package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.TypeOperation;
import com.mycompany.myapp.service.dto.TypeOperationDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link TypeOperation} and its DTO {@link TypeOperationDTO}.
 */
@Mapper(componentModel = "spring")
public interface TypeOperationMapper extends EntityMapper<TypeOperationDTO, TypeOperation> {}
