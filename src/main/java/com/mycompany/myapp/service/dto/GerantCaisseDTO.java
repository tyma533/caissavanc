package com.mycompany.myapp.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link com.mycompany.myapp.domain.GerantCaisse} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class GerantCaisseDTO implements Serializable {

    private Long id;

    private Boolean actif;

    private Instant dateHeureModification;

    private Instant dateHeureCreation;

    private Long utiCree;

    private Long utiModifie;

    private CaisseDTO caisse;

    private GerantDTO gerant;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getActif() {
        return actif;
    }

    public void setActif(Boolean actif) {
        this.actif = actif;
    }

    public Instant getDateHeureModification() {
        return dateHeureModification;
    }

    public void setDateHeureModification(Instant dateHeureModification) {
        this.dateHeureModification = dateHeureModification;
    }

    public Instant getDateHeureCreation() {
        return dateHeureCreation;
    }

    public void setDateHeureCreation(Instant dateHeureCreation) {
        this.dateHeureCreation = dateHeureCreation;
    }

    public Long getUtiCree() {
        return utiCree;
    }

    public void setUtiCree(Long utiCree) {
        this.utiCree = utiCree;
    }

    public Long getUtiModifie() {
        return utiModifie;
    }

    public void setUtiModifie(Long utiModifie) {
        this.utiModifie = utiModifie;
    }

    public CaisseDTO getCaisse() {
        return caisse;
    }

    public void setCaisse(CaisseDTO caisse) {
        this.caisse = caisse;
    }

    public GerantDTO getGerant() {
        return gerant;
    }

    public void setGerant(GerantDTO gerant) {
        this.gerant = gerant;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof GerantCaisseDTO)) {
            return false;
        }

        GerantCaisseDTO gerantCaisseDTO = (GerantCaisseDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, gerantCaisseDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "GerantCaisseDTO{" +
            "id=" + getId() +
            ", actif='" + getActif() + "'" +
            ", dateHeureModification='" + getDateHeureModification() + "'" +
            ", dateHeureCreation='" + getDateHeureCreation() + "'" +
            ", utiCree=" + getUtiCree() +
            ", utiModifie=" + getUtiModifie() +
            ", caisse=" + getCaisse() +
            ", gerant=" + getGerant() +
            "}";
    }
}
