package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A PieceJustificatif.
 */
@Entity
@Table(name = "piece_justificatif")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class PieceJustificatif implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "libelle")
    private String libelle;

    @Lob
    @Column(name = "piece")
    private byte[] piece;

    @Column(name = "piece_content_type")
    private String pieceContentType;

    @Column(name = "date_heure_modification")
    private Instant dateHeureModification;

    @Column(name = "date_heure_creation")
    private Instant dateHeureCreation;

    @Column(name = "uti_cree")
    private Long utiCree;

    @Column(name = "uti_modifie")
    private Long utiModifie;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "caisse", "typeOperation", "modeOperation" }, allowSetters = true)
    private Operation operation;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public PieceJustificatif id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLibelle() {
        return this.libelle;
    }

    public PieceJustificatif libelle(String libelle) {
        this.setLibelle(libelle);
        return this;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public byte[] getPiece() {
        return this.piece;
    }

    public PieceJustificatif piece(byte[] piece) {
        this.setPiece(piece);
        return this;
    }

    public void setPiece(byte[] piece) {
        this.piece = piece;
    }

    public String getPieceContentType() {
        return this.pieceContentType;
    }

    public PieceJustificatif pieceContentType(String pieceContentType) {
        this.pieceContentType = pieceContentType;
        return this;
    }

    public void setPieceContentType(String pieceContentType) {
        this.pieceContentType = pieceContentType;
    }

    public Instant getDateHeureModification() {
        return this.dateHeureModification;
    }

    public PieceJustificatif dateHeureModification(Instant dateHeureModification) {
        this.setDateHeureModification(dateHeureModification);
        return this;
    }

    public void setDateHeureModification(Instant dateHeureModification) {
        this.dateHeureModification = dateHeureModification;
    }

    public Instant getDateHeureCreation() {
        return this.dateHeureCreation;
    }

    public PieceJustificatif dateHeureCreation(Instant dateHeureCreation) {
        this.setDateHeureCreation(dateHeureCreation);
        return this;
    }

    public void setDateHeureCreation(Instant dateHeureCreation) {
        this.dateHeureCreation = dateHeureCreation;
    }

    public Long getUtiCree() {
        return this.utiCree;
    }

    public PieceJustificatif utiCree(Long utiCree) {
        this.setUtiCree(utiCree);
        return this;
    }

    public void setUtiCree(Long utiCree) {
        this.utiCree = utiCree;
    }

    public Long getUtiModifie() {
        return this.utiModifie;
    }

    public PieceJustificatif utiModifie(Long utiModifie) {
        this.setUtiModifie(utiModifie);
        return this;
    }

    public void setUtiModifie(Long utiModifie) {
        this.utiModifie = utiModifie;
    }

    public Operation getOperation() {
        return this.operation;
    }

    public void setOperation(Operation operation) {
        this.operation = operation;
    }

    public PieceJustificatif operation(Operation operation) {
        this.setOperation(operation);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PieceJustificatif)) {
            return false;
        }
        return getId() != null && getId().equals(((PieceJustificatif) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PieceJustificatif{" +
            "id=" + getId() +
            ", libelle='" + getLibelle() + "'" +
            ", piece='" + getPiece() + "'" +
            ", pieceContentType='" + getPieceContentType() + "'" +
            ", dateHeureModification='" + getDateHeureModification() + "'" +
            ", dateHeureCreation='" + getDateHeureCreation() + "'" +
            ", utiCree=" + getUtiCree() +
            ", utiModifie=" + getUtiModifie() +
            "}";
    }
}
