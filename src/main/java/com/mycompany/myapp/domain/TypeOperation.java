package com.mycompany.myapp.domain;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A TypeOperation.
 */
@Entity
@Table(name = "type_operation")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class TypeOperation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator", sequenceName = "type_operation_seq", allocationSize = 1)
    @Column(name = "id")
    private Long id;

    @Column(name = "libelle")
    private String libelle;

    @Column(name = "date_heure_modification")
    private Instant dateHeureModification;

    @Column(name = "date_heure_creation")
    private Instant dateHeureCreation;

    @Column(name = "uti_cree")
    private Long utiCree;

    @Column(name = "uti_modifie")
    private Long utiModifie;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public TypeOperation id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLibelle() {
        return this.libelle;
    }

    public TypeOperation libelle(String libelle) {
        this.setLibelle(libelle);
        return this;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public Instant getDateHeureModification() {
        return this.dateHeureModification;
    }

    public TypeOperation dateHeureModification(Instant dateHeureModification) {
        this.setDateHeureModification(dateHeureModification);
        return this;
    }

    public void setDateHeureModification(Instant dateHeureModification) {
        this.dateHeureModification = dateHeureModification;
    }

    public Instant getDateHeureCreation() {
        return this.dateHeureCreation;
    }

    public TypeOperation dateHeureCreation(Instant dateHeureCreation) {
        this.setDateHeureCreation(dateHeureCreation);
        return this;
    }

    public void setDateHeureCreation(Instant dateHeureCreation) {
        this.dateHeureCreation = dateHeureCreation;
    }

    public Long getUtiCree() {
        return this.utiCree;
    }

    public TypeOperation utiCree(Long utiCree) {
        this.setUtiCree(utiCree);
        return this;
    }

    public void setUtiCree(Long utiCree) {
        this.utiCree = utiCree;
    }

    public Long getUtiModifie() {
        return this.utiModifie;
    }

    public TypeOperation utiModifie(Long utiModifie) {
        this.setUtiModifie(utiModifie);
        return this;
    }

    public void setUtiModifie(Long utiModifie) {
        this.utiModifie = utiModifie;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TypeOperation)) {
            return false;
        }
        return getId() != null && getId().equals(((TypeOperation) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TypeOperation{" +
            "id=" + getId() +
            ", libelle='" + getLibelle() + "'" +
            ", dateHeureModification='" + getDateHeureModification() + "'" +
            ", dateHeureCreation='" + getDateHeureCreation() + "'" +
            ", utiCree=" + getUtiCree() +
            ", utiModifie=" + getUtiModifie() +
            "}";
    }

    public void setCaisseId(Long id2) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setCaisseId'");
    }

    public void setMontant(Long montant) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setMontant'");
    }

    public void setType(String string) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setType'");
    }
}
