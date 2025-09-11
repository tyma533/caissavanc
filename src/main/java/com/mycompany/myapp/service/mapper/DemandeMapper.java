package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.Demande;
import com.mycompany.myapp.domain.Etablissement;
import com.mycompany.myapp.domain.ModeOperation;
import com.mycompany.myapp.service.dto.DemandeDTO;
import com.mycompany.myapp.service.dto.EtablissementDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Demande} and its DTO {@link DemandeDTO}.
 */
@Mapper(componentModel = "spring")
public interface DemandeMapper extends EntityMapper<DemandeDTO, Demande> {
    @Mapping(target = "etablissement", source = "etablissement")
    @Mapping(target = "modeOperationId", source = "modeOperation.id")
    DemandeDTO toDto(Demande demande);

    @Mapping(target = "modeOperation", source = "modeOperationId")
    Demande toEntity(DemandeDTO dto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void partialUpdate(@MappingTarget Demande entity, DemandeDTO dto);

    @Named("etablissementId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    EtablissementDTO toDtoEtablissementId(Etablissement etablissement);

    // Conversion de l'id vers l'entité ModeOperation
    default ModeOperation fromId(Long id) {
        if (id == null) {
            return null;
        }
        ModeOperation modeOperation = new ModeOperation();
        modeOperation.setId(id);
        return modeOperation;
    }
}
