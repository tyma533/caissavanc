package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.Caisse;
import com.mycompany.myapp.domain.Demande;
import com.mycompany.myapp.domain.Etablissement;
import com.mycompany.myapp.domain.ModeOperation;
import com.mycompany.myapp.service.dto.DemandeDTO;
import com.mycompany.myapp.service.dto.EtablissementDTO;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface DemandeMapper extends EntityMapper<DemandeDTO, Demande> {
    // Convertit l'entité Demande en DTO
    @Mapping(target = "etablissement", source = "etablissement")
    @Mapping(target = "modeOperationId", source = "modeOperation.id") // plus utilisé
    @Mapping(target = "caisseId", source = "caisse.id") // convertit la caisse en son ID
    DemandeDTO toDto(Demande demande);

    // Convertit le DTO en entité
    @Mapping(target = "modeOperation", source = "modeOperationId", qualifiedByName = "modeOperationFromId") // sera forcé côté service
    @Mapping(target = "caisse", source = "caisseId", qualifiedByName = "caisseFromId")
    Demande toEntity(DemandeDTO dto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void partialUpdate(@MappingTarget Demande entity, DemandeDTO dto);

    @Named("etablissementId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    EtablissementDTO toDtoEtablissementId(Etablissement etablissement);

    @Named("caisseFromId")
    default Caisse caisseFromId(Long id) {
        if (id == null) {
            return null;
        }
        Caisse caisse = new Caisse();
        caisse.setId(id);
        return caisse;
    }

    @Named("modeOperationFromId")
    default ModeOperation modeOperationFromId(Long id) {
        if (id == null) return null;
        ModeOperation mode = new ModeOperation();
        mode.setId(id);
        return mode;
    }
}
