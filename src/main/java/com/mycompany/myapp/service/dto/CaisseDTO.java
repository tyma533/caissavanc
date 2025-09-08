package com.mycompany.myapp.service.dto;

import com.mycompany.myapp.domain.Etablissement;
import com.mycompany.myapp.domain.enumeration.EtatCaisse;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link com.mycompany.myapp.domain.Caisse} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CaisseDTO implements Serializable {

    private Long id;

    @NotNull
    private String libelle;

    private Instant dateCreationCaisse;

    private Instant dateFermiture;

    @NotNull
    private Long solde;

    @NotNull
    private EtatCaisse etat;

    private Instant dateHeureModification;

    private Instant dateHeureCreation;

    private Long utiCree;

    private Long utiModifie;

    private Etablissement etablissement;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLibelle() {
        return libelle;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public Instant getDateCreationCaisse() {
        return dateCreationCaisse;
    }

    public void setDateCreationCaisse(Instant dateCreationCaisse) {
        this.dateCreationCaisse = dateCreationCaisse;
    }

    public Instant getDateFermiture() {
        return dateFermiture;
    }

    public void setDateFermiture(Instant dateFermiture) {
        this.dateFermiture = dateFermiture;
    }

    public Long getSolde() {
        return solde;
    }

    public void setSolde(Long solde) {
        this.solde = solde;
    }

    public EtatCaisse getEtat() {
        return etat;
    }

    public void setEtat(EtatCaisse etat) {
        this.etat = etat;
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

    public Etablissement getEtablissement() {
        return etablissement;
    }

    public void setEtablissement(Etablissement etablissement) {
        this.etablissement = etablissement;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CaisseDTO)) {
            return false;
        }

        CaisseDTO caisseDTO = (CaisseDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, caisseDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CaisseDTO{" +
            "id=" + getId() +
            ", libelle='" + getLibelle() + "'" +
            ", dateCreationCaisse='" + getDateCreationCaisse() + "'" +
            ", dateFermiture='" + getDateFermiture() + "'" +
            ", solde=" + getSolde() +
            ", etat='" + getEtat() + "'" +
            ", dateHeureModification='" + getDateHeureModification() + "'" +
            ", dateHeureCreation='" + getDateHeureCreation() + "'" +
            ", utiCree=" + getUtiCree() +
            ", utiModifie=" + getUtiModifie() +
            ", etablissement=" + getEtablissement() +
            "}";
    }
}
