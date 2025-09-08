package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.Caisse;
import com.mycompany.myapp.domain.Etablissement;
import com.mycompany.myapp.service.dto.CaisseDTO;
import com.mycompany.myapp.service.dto.EtablissementDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CaisseMapper extends EntityMapper<CaisseDTO, Caisse> {
    @Mapping(target = "etablissement", source = "etablissement")
    CaisseDTO toDto(Caisse caisse);

    // Mapping manuel pour Etablissement → EtablissementDTO
    default EtablissementDTO toDtoEtablissement(Etablissement etablissement) {
        if (etablissement == null) {
            return null;
        }
        EtablissementDTO dto = new EtablissementDTO();
        dto.setId(etablissement.getId());
        dto.setLibelle(etablissement.getLibelle()); // si tu veux mapper d’autres champs
        return dto;
    }
}
