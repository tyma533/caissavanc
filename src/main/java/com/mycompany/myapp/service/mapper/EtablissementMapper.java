package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.Etablissement;
import com.mycompany.myapp.service.dto.EtablissementDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Etablissement} and its DTO {@link EtablissementDTO}.
 */
@Mapper(componentModel = "spring")
public interface EtablissementMapper extends EntityMapper<EtablissementDTO, Etablissement> {}
