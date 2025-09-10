package com.mycompany.myapp.service.dto;

import com.mycompany.myapp.domain.ModeOperation;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link com.mycompany.myapp.domain.Operation} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class OperationDTO implements Serializable {

    private Long id;

    @NotNull
    private String numero;

    @NotNull
    private String commentaire;

    @NotNull
    private Long montant;

    private Instant dateOperation;

    private Instant dateHeureModification;

    private Instant dateHeureCreation;

    private Long utiCree;

    private Long utiModifie;

    private CaisseDTO caisse;

    private TypeOperationDTO typeOperation;

    private Long modeOperationId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getCommentaire() {
        return commentaire;
    }

    public void setCommentaire(String commentaire) {
        this.commentaire = commentaire;
    }

    public Long getMontant() {
        return montant;
    }

    public void setMontant(Long montant) {
        this.montant = montant;
    }

    public Instant getDateOperation() {
        return dateOperation;
    }

    public void setDateOperation(Instant dateOperation) {
        this.dateOperation = dateOperation;
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

    public TypeOperationDTO getTypeOperation() {
        return typeOperation;
    }

    public void setTypeOperation(TypeOperationDTO typeOperation) {
        this.typeOperation = typeOperation;
    }

    public Long getModeOperationId() {
        return modeOperationId;
    }

    public void setModeOperationId(Long modeOperationId) {
        this.modeOperationId = modeOperationId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof OperationDTO)) {
            return false;
        }

        OperationDTO operationDTO = (OperationDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, operationDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "OperationDTO{" +
            "id=" + getId() +
            ", numero='" + getNumero() + "'" +
            ", commentaire='" + getCommentaire() + "'" +
            ", montant=" + getMontant() +
            ", dateOperation='" + getDateOperation() + "'" +
            ", dateHeureModification='" + getDateHeureModification() + "'" +
            ", dateHeureCreation='" + getDateHeureCreation() + "'" +
            ", utiCree=" + getUtiCree() +
            ", utiModifie=" + getUtiModifie() +
            ", caisse=" + getCaisse() +
            ", typeOperation=" + getTypeOperation() +
            ", modeOperation=" + getModeOperationId() +
            "}";
    }
}
