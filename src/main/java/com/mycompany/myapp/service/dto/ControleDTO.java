package com.mycompany.myapp.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link com.mycompany.myapp.domain.Controle} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ControleDTO implements Serializable {

    private Long id;

    private Instant dateControle;

    private String observation;

    private Instant dateHeureModification;

    private Instant dateHeureCreation;

    private Long utiCree;

    private Long utiModifie;

    private CaisseDTO caisse;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getDateControle() {
        return dateControle;
    }

    public void setDateControle(Instant dateControle) {
        this.dateControle = dateControle;
    }

    public String getObservation() {
        return observation;
    }

    public void setObservation(String observation) {
        this.observation = observation;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ControleDTO)) {
            return false;
        }

        ControleDTO controleDTO = (ControleDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, controleDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ControleDTO{" +
            "id=" + getId() +
            ", dateControle='" + getDateControle() + "'" +
            ", observation='" + getObservation() + "'" +
            ", dateHeureModification='" + getDateHeureModification() + "'" +
            ", dateHeureCreation='" + getDateHeureCreation() + "'" +
            ", utiCree=" + getUtiCree() +
            ", utiModifie=" + getUtiModifie() +
            ", caisse=" + getCaisse() +
            "}";
    }
}
