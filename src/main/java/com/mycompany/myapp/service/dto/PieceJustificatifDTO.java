package com.mycompany.myapp.service.dto;

import jakarta.persistence.Lob;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link com.mycompany.myapp.domain.PieceJustificatif} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class PieceJustificatifDTO implements Serializable {

    private Long id;

    private String libelle;

    @Lob
    private byte[] piece;

    private String pieceContentType;
    private Instant dateHeureModification;

    private Instant dateHeureCreation;

    private Long utiCree;

    private Long utiModifie;

    private OperationDTO operation;

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

    public byte[] getPiece() {
        return piece;
    }

    public void setPiece(byte[] piece) {
        this.piece = piece;
    }

    public String getPieceContentType() {
        return pieceContentType;
    }

    public void setPieceContentType(String pieceContentType) {
        this.pieceContentType = pieceContentType;
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

    public OperationDTO getOperation() {
        return operation;
    }

    public void setOperation(OperationDTO operation) {
        this.operation = operation;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PieceJustificatifDTO)) {
            return false;
        }

        PieceJustificatifDTO pieceJustificatifDTO = (PieceJustificatifDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, pieceJustificatifDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PieceJustificatifDTO{" +
            "id=" + getId() +
            ", libelle='" + getLibelle() + "'" +
            ", piece='" + getPiece() + "'" +
            ", dateHeureModification='" + getDateHeureModification() + "'" +
            ", dateHeureCreation='" + getDateHeureCreation() + "'" +
            ", utiCree=" + getUtiCree() +
            ", utiModifie=" + getUtiModifie() +
            ", operation=" + getOperation() +
            "}";
    }
}
