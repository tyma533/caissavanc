package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.EtatOperation;
import com.mycompany.myapp.service.dto.EtatOperationDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link EtatOperation} and its DTO {@link EtatOperationDTO}.
 */
@Mapper(componentModel = "spring")
public interface EtatOperationMapper extends EntityMapper<EtatOperationDTO, EtatOperation> {}
