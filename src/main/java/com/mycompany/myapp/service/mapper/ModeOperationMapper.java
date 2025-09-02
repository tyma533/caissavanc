package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.ModeOperation;
import com.mycompany.myapp.service.dto.ModeOperationDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link ModeOperation} and its DTO {@link ModeOperationDTO}.
 */
@Mapper(componentModel = "spring")
public interface ModeOperationMapper extends EntityMapper<ModeOperationDTO, ModeOperation> {}
