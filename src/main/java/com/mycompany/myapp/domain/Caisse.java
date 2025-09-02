package com.mycompany.myapp.domain;

import com.mycompany.myapp.domain.enumeration.EtatCaisse;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Caisse.
 */
@Entity
@Table(name = "caisse")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Caisse implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "libelle", nullable = false)
    private String libelle;

    @Column(name = "date_creation_caisse")
    private Instant dateCreationCaisse;

    @Column(name = "date_fermiture")
    private Instant dateFermiture;

    @NotNull
    @Column(name = "solde", nullable = false)
    private Long solde;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "etat", nullable = false)
    private EtatCaisse etat;

    @Column(name = "date_heure_modification")
    private Instant dateHeureModification;

    @Column(name = "date_heure_creation")
    private Instant dateHeureCreation;

    @Column(name = "uti_cree")
    private Long utiCree;

    @Column(name = "uti_modifie")
    private Long utiModifie;

    @ManyToOne(fetch = FetchType.LAZY)
    private Etablissement etablissement;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Caisse id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLibelle() {
        return this.libelle;
    }

    public Caisse libelle(String libelle) {
        this.setLibelle(libelle);
        return this;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public Instant getDateCreationCaisse() {
        return this.dateCreationCaisse;
    }

    public Caisse dateCreationCaisse(Instant dateCreationCaisse) {
        this.setDateCreationCaisse(dateCreationCaisse);
        return this;
    }

    public void setDateCreationCaisse(Instant dateCreationCaisse) {
        this.dateCreationCaisse = dateCreationCaisse;
    }

    public Instant getDateFermiture() {
        return this.dateFermiture;
    }

    public Caisse dateFermiture(Instant dateFermiture) {
        this.setDateFermiture(dateFermiture);
        return this;
    }

    public void setDateFermiture(Instant dateFermiture) {
        this.dateFermiture = dateFermiture;
    }

    public Long getSolde() {
        return this.solde;
    }

    public Caisse solde(Long solde) {
        this.setSolde(solde);
        return this;
    }

    public void setSolde(Long solde) {
        this.solde = solde;
    }

    public EtatCaisse getEtat() {
        return this.etat;
    }

    public Caisse etat(EtatCaisse etat) {
        this.setEtat(etat);
        return this;
    }

    public void setEtat(EtatCaisse etat) {
        this.etat = etat;
    }

    public Instant getDateHeureModification() {
        return this.dateHeureModification;
    }

    public Caisse dateHeureModification(Instant dateHeureModification) {
        this.setDateHeureModification(dateHeureModification);
        return this;
    }

    public void setDateHeureModification(Instant dateHeureModification) {
        this.dateHeureModification = dateHeureModification;
    }

    public Instant getDateHeureCreation() {
        return this.dateHeureCreation;
    }

    public Caisse dateHeureCreation(Instant dateHeureCreation) {
        this.setDateHeureCreation(dateHeureCreation);
        return this;
    }

    public void setDateHeureCreation(Instant dateHeureCreation) {
        this.dateHeureCreation = dateHeureCreation;
    }

    public Long getUtiCree() {
        return this.utiCree;
    }

    public Caisse utiCree(Long utiCree) {
        this.setUtiCree(utiCree);
        return this;
    }

    public void setUtiCree(Long utiCree) {
        this.utiCree = utiCree;
    }

    public Long getUtiModifie() {
        return this.utiModifie;
    }

    public Caisse utiModifie(Long utiModifie) {
        this.setUtiModifie(utiModifie);
        return this;
    }

    public void setUtiModifie(Long utiModifie) {
        this.utiModifie = utiModifie;
    }

    public Etablissement getEtablissement() {
        return this.etablissement;
    }

    public void setEtablissement(Etablissement etablissement) {
        this.etablissement = etablissement;
    }

    public Caisse etablissement(Etablissement etablissement) {
        this.setEtablissement(etablissement);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Caisse)) {
            return false;
        }
        return getId() != null && getId().equals(((Caisse) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Caisse{" +
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
            "}";
    }
}
