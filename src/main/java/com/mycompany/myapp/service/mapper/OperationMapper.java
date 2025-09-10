package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.Caisse;
import com.mycompany.myapp.domain.ModeOperation;
import com.mycompany.myapp.domain.Operation;
import com.mycompany.myapp.domain.TypeOperation;
import com.mycompany.myapp.service.dto.CaisseDTO;
import com.mycompany.myapp.service.dto.ModeOperationDTO;
import com.mycompany.myapp.service.dto.OperationDTO;
import com.mycompany.myapp.service.dto.TypeOperationDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Operation} and its DTO {@link OperationDTO}.
 */
@Mapper(componentModel = "spring")
public interface OperationMapper extends EntityMapper<OperationDTO, Operation> {
    @Named("modeOperationId")
    default Long mapModeOperationToId(ModeOperation modeOperation) {
        return modeOperation != null ? modeOperation.getId() : null;
    }

    @Mapping(target = "caisse", source = "caisse", qualifiedByName = "caisseId")
    @Mapping(target = "typeOperation", source = "typeOperation", qualifiedByName = "typeOperationId")
    @Mapping(target = "modeOperationId", source = "modeOperation", qualifiedByName = "modeOperationId")
    OperationDTO toDto(Operation s);

    Operation toEntity(OperationDTO operationDTO);

    @Named("caisseId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    CaisseDTO toDtoCaisseId(Caisse caisse);

    @Named("typeOperationId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    TypeOperationDTO toDtoTypeOperationId(TypeOperation typeOperation);
}
