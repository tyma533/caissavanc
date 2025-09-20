package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Operation.
 */
@Entity
@Table(name = "operation")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Operation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "numero", nullable = false)
    private String numero;

    @NotNull
    @Column(name = "commentaire", nullable = false)
    private String commentaire;

    @NotNull
    @Column(name = "montant", nullable = false)
    private Long montant;

    @Column(name = "numeroVC")
    private String numeroVC;

    @Column(name = "banque")
    private String banque;

    @Column(name = "beneficiaire")
    private String beneficiaire;

    @Column(name = "crediteur")
    private String crediteur;

    @Column(name = "date_operation")
    private Instant dateOperation;

    @Column(name = "date_heure_modification")
    private Instant dateHeureModification;

    @Column(name = "date_heure_creation")
    private Instant dateHeureCreation;

    @Column(name = "uti_cree")
    private Long utiCree;

    @Column(name = "uti_modifie")
    private Long utiModifie;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "etablissement" }, allowSetters = true)
    private Caisse caisse;

    @ManyToOne(fetch = FetchType.LAZY)
    private TypeOperation typeOperation;

    @ManyToOne(fetch = FetchType.LAZY)
    private ModeOperation modeOperation;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Operation id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumero() {
        return this.numero;
    }

    public Operation numero(String numero) {
        this.setNumero(numero);
        return this;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getCommentaire() {
        return this.commentaire;
    }

    public Operation commentaire(String commentaire) {
        this.setCommentaire(commentaire);
        return this;
    }

    public void setCommentaire(String commentaire) {
        this.commentaire = commentaire;
    }

    public Long getMontant() {
        return this.montant;
    }

    public Operation montant(Long montant) {
        this.setMontant(montant);
        return this;
    }

    public void setMontant(Long montant) {
        this.montant = montant;
    }

    public Instant getDateOperation() {
        return this.dateOperation;
    }

    public Operation dateOperation(Instant dateOperation) {
        this.setDateOperation(dateOperation);
        return this;
    }

    public void setDateOperation(Instant dateOperation) {
        this.dateOperation = dateOperation;
    }

    public Instant getDateHeureModification() {
        return this.dateHeureModification;
    }

    public Operation dateHeureModification(Instant dateHeureModification) {
        this.setDateHeureModification(dateHeureModification);
        return this;
    }

    public void setDateHeureModification(Instant dateHeureModification) {
        this.dateHeureModification = dateHeureModification;
    }

    public Instant getDateHeureCreation() {
        return this.dateHeureCreation;
    }

    public Operation dateHeureCreation(Instant dateHeureCreation) {
        this.setDateHeureCreation(dateHeureCreation);
        return this;
    }

    public void setDateHeureCreation(Instant dateHeureCreation) {
        this.dateHeureCreation = dateHeureCreation;
    }

    public Long getUtiCree() {
        return this.utiCree;
    }

    public Operation utiCree(Long utiCree) {
        this.setUtiCree(utiCree);
        return this;
    }

    public void setUtiCree(Long utiCree) {
        this.utiCree = utiCree;
    }

    public Long getUtiModifie() {
        return this.utiModifie;
    }

    public Operation utiModifie(Long utiModifie) {
        this.setUtiModifie(utiModifie);
        return this;
    }

    public void setUtiModifie(Long utiModifie) {
        this.utiModifie = utiModifie;
    }

    public Caisse getCaisse() {
        return this.caisse;
    }

    public void setCaisse(Caisse caisse) {
        this.caisse = caisse;
    }

    public Operation caisse(Caisse caisse) {
        this.setCaisse(caisse);
        return this;
    }

    public TypeOperation getTypeOperation() {
        return this.typeOperation;
    }

    public void setTypeOperation(TypeOperation typeOperation) {
        this.typeOperation = typeOperation;
    }

    public Operation typeOperation(TypeOperation typeOperation) {
        this.setTypeOperation(typeOperation);
        return this;
    }

    public ModeOperation getModeOperation() {
        return this.modeOperation;
    }

    public void setModeOperation(ModeOperation modeOperation) {
        this.modeOperation = modeOperation;
    }

    public Operation modeOperation(ModeOperation modeOperation) {
        this.setModeOperation(modeOperation);
        return this;
    }

    public String getNumeroVC() {
        return numeroVC;
    }

    public void setNumeroVC(String numeroVC) {
        this.numeroVC = numeroVC;
    }

    public String getBanque() {
        return banque;
    }

    public void setBanque(String banque) {
        this.banque = banque;
    }

    public String getBeneficiaire() {
        return beneficiaire;
    }

    public void setBeneficiaire(String beneficiaire) {
        this.beneficiaire = beneficiaire;
    }

    public String getCrediteur() {
        return crediteur;
    }

    public void setCrediteur(String crediteur) {
        this.crediteur = crediteur;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Operation)) {
            return false;
        }
        return getId() != null && getId().equals(((Operation) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Operation{" +
            "id=" + getId() +
            ", numero='" + getNumero() + "'" +
            ", commentaire='" + getCommentaire() + "'" +
            ", montant=" + getMontant() +
            ", numeroVC='" + getNumeroVC() + "'" +
            ", banque='" + getBanque() + "'" +
            ", beneficière='" + getBeneficiaire() + "'" +
            ", crediteur='" + getCrediteur() + "'" +
            ", dateOperation='" + getDateOperation() + "'" +
            ", dateHeureModification='" + getDateHeureModification() + "'" +
            ", dateHeureCreation='" + getDateHeureCreation() + "'" +
            ", utiCree=" + getUtiCree() +
            ", utiModifie=" + getUtiModifie() +
            "}";
    }
}
