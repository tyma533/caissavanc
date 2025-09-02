package com.mycompany.myapp.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link com.mycompany.myapp.domain.Gerant} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class GerantDTO implements Serializable {

    private Long id;

    private String nom;

    private Instant dateNomination;

    private Instant dateFin;

    private Instant dateHeureModification;

    private Instant dateHeureCreation;

    private Long utiCree;

    private Long utiModifie;

    private AgentEtatProfilDTO agentEtatProfil;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public Instant getDateNomination() {
        return dateNomination;
    }

    public void setDateNomination(Instant dateNomination) {
        this.dateNomination = dateNomination;
    }

    public Instant getDateFin() {
        return dateFin;
    }

    public void setDateFin(Instant dateFin) {
        this.dateFin = dateFin;
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

    public AgentEtatProfilDTO getAgentEtatProfil() {
        return agentEtatProfil;
    }

    public void setAgentEtatProfil(AgentEtatProfilDTO agentEtatProfil) {
        this.agentEtatProfil = agentEtatProfil;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof GerantDTO)) {
            return false;
        }

        GerantDTO gerantDTO = (GerantDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, gerantDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "GerantDTO{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", dateNomination='" + getDateNomination() + "'" +
            ", dateFin='" + getDateFin() + "'" +
            ", dateHeureModification='" + getDateHeureModification() + "'" +
            ", dateHeureCreation='" + getDateHeureCreation() + "'" +
            ", utiCree=" + getUtiCree() +
            ", utiModifie=" + getUtiModifie() +
            ", agentEtatProfil=" + getAgentEtatProfil() +
            "}";
    }
}
