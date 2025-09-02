package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Gerant.
 */
@Entity
@Table(name = "gerant")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Gerant implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "nom")
    private String nom;

    @Column(name = "date_nomination")
    private Instant dateNomination;

    @Column(name = "date_fin")
    private Instant dateFin;

    @Column(name = "date_heure_modification")
    private Instant dateHeureModification;

    @Column(name = "date_heure_creation")
    private Instant dateHeureCreation;

    @Column(name = "uti_cree")
    private Long utiCree;

    @Column(name = "uti_modifie")
    private Long utiModifie;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "agent", "etablissement" }, allowSetters = true)
    private AgentEtatProfil agentEtatProfil;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Gerant id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return this.nom;
    }

    public Gerant nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public Instant getDateNomination() {
        return this.dateNomination;
    }

    public Gerant dateNomination(Instant dateNomination) {
        this.setDateNomination(dateNomination);
        return this;
    }

    public void setDateNomination(Instant dateNomination) {
        this.dateNomination = dateNomination;
    }

    public Instant getDateFin() {
        return this.dateFin;
    }

    public Gerant dateFin(Instant dateFin) {
        this.setDateFin(dateFin);
        return this;
    }

    public void setDateFin(Instant dateFin) {
        this.dateFin = dateFin;
    }

    public Instant getDateHeureModification() {
        return this.dateHeureModification;
    }

    public Gerant dateHeureModification(Instant dateHeureModification) {
        this.setDateHeureModification(dateHeureModification);
        return this;
    }

    public void setDateHeureModification(Instant dateHeureModification) {
        this.dateHeureModification = dateHeureModification;
    }

    public Instant getDateHeureCreation() {
        return this.dateHeureCreation;
    }

    public Gerant dateHeureCreation(Instant dateHeureCreation) {
        this.setDateHeureCreation(dateHeureCreation);
        return this;
    }

    public void setDateHeureCreation(Instant dateHeureCreation) {
        this.dateHeureCreation = dateHeureCreation;
    }

    public Long getUtiCree() {
        return this.utiCree;
    }

    public Gerant utiCree(Long utiCree) {
        this.setUtiCree(utiCree);
        return this;
    }

    public void setUtiCree(Long utiCree) {
        this.utiCree = utiCree;
    }

    public Long getUtiModifie() {
        return this.utiModifie;
    }

    public Gerant utiModifie(Long utiModifie) {
        this.setUtiModifie(utiModifie);
        return this;
    }

    public void setUtiModifie(Long utiModifie) {
        this.utiModifie = utiModifie;
    }

    public AgentEtatProfil getAgentEtatProfil() {
        return this.agentEtatProfil;
    }

    public void setAgentEtatProfil(AgentEtatProfil agentEtatProfil) {
        this.agentEtatProfil = agentEtatProfil;
    }

    public Gerant agentEtatProfil(AgentEtatProfil agentEtatProfil) {
        this.setAgentEtatProfil(agentEtatProfil);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Gerant)) {
            return false;
        }
        return getId() != null && getId().equals(((Gerant) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Gerant{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", dateNomination='" + getDateNomination() + "'" +
            ", dateFin='" + getDateFin() + "'" +
            ", dateHeureModification='" + getDateHeureModification() + "'" +
            ", dateHeureCreation='" + getDateHeureCreation() + "'" +
            ", utiCree=" + getUtiCree() +
            ", utiModifie=" + getUtiModifie() +
            "}";
    }
}
