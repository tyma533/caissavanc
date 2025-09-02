package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.Operation;
import com.mycompany.myapp.domain.PieceJustificatif;
import com.mycompany.myapp.service.dto.OperationDTO;
import com.mycompany.myapp.service.dto.PieceJustificatifDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link PieceJustificatif} and its DTO {@link PieceJustificatifDTO}.
 */
@Mapper(componentModel = "spring")
public interface PieceJustificatifMapper extends EntityMapper<PieceJustificatifDTO, PieceJustificatif> {
    @Mapping(target = "operation", source = "operation", qualifiedByName = "operationId")
    PieceJustificatifDTO toDto(PieceJustificatif s);

    @Named("operationId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    OperationDTO toDtoOperationId(Operation operation);
}
