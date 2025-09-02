package com.mycompany.myapp.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Objects;

/**
 * A DTO for the {@link com.mycompany.myapp.domain.Agent} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class AgentDTO implements Serializable {

    private Long id;

    @NotNull
    private String codeMatrile;

    @NotNull
    @Size(max = 20)
    private String cni;

    private String statutAgent;

    private String nom;

    private String prenom;

    private String sexe;

    @NotNull
    private String emailUcad;

    private String telephone;

    private String fonctionAgent;

    private String typePersonnel;

    private LocalDate dateDeNaissance;

    private String lieuNaissance;

    private String nationalite;

    private String email;

    private String adresse;

    private Boolean externe;

    private Boolean actif;

    private String role;

    private Instant dateHeureModification;

    private Instant dateHeureCreation;

    private String modifiedBy;

    private String createdBy;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodeMatrile() {
        return codeMatrile;
    }

    public void setCodeMatrile(String codeMatrile) {
        this.codeMatrile = codeMatrile;
    }

    public String getCni() {
        return cni;
    }

    public void setCni(String cni) {
        this.cni = cni;
    }

    public String getStatutAgent() {
        return statutAgent;
    }

    public void setStatutAgent(String statutAgent) {
        this.statutAgent = statutAgent;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getSexe() {
        return sexe;
    }

    public void setSexe(String sexe) {
        this.sexe = sexe;
    }

    public String getEmailUcad() {
        return emailUcad;
    }

    public void setEmailUcad(String emailUcad) {
        this.emailUcad = emailUcad;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getFonctionAgent() {
        return fonctionAgent;
    }

    public void setFonctionAgent(String fonctionAgent) {
        this.fonctionAgent = fonctionAgent;
    }

    public String getTypePersonnel() {
        return typePersonnel;
    }

    public void setTypePersonnel(String typePersonnel) {
        this.typePersonnel = typePersonnel;
    }

    public LocalDate getDateDeNaissance() {
        return dateDeNaissance;
    }

    public void setDateDeNaissance(LocalDate dateDeNaissance) {
        this.dateDeNaissance = dateDeNaissance;
    }

    public String getLieuNaissance() {
        return lieuNaissance;
    }

    public void setLieuNaissance(String lieuNaissance) {
        this.lieuNaissance = lieuNaissance;
    }

    public String getNationalite() {
        return nationalite;
    }

    public void setNationalite(String nationalite) {
        this.nationalite = nationalite;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public Boolean getExterne() {
        return externe;
    }

    public void setExterne(Boolean externe) {
        this.externe = externe;
    }

    public Boolean getActif() {
        return actif;
    }

    public void setActif(Boolean actif) {
        this.actif = actif;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
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

    public String getModifiedBy() {
        return modifiedBy;
    }

    public void setModifiedBy(String modifiedBy) {
        this.modifiedBy = modifiedBy;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AgentDTO)) {
            return false;
        }

        AgentDTO agentDTO = (AgentDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, agentDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AgentDTO{" +
            "id=" + getId() +
            ", codeMatrile='" + getCodeMatrile() + "'" +
            ", cni='" + getCni() + "'" +
            ", statutAgent='" + getStatutAgent() + "'" +
            ", nom='" + getNom() + "'" +
            ", prenom='" + getPrenom() + "'" +
            ", sexe='" + getSexe() + "'" +
            ", emailUcad='" + getEmailUcad() + "'" +
            ", telephone='" + getTelephone() + "'" +
            ", fonctionAgent='" + getFonctionAgent() + "'" +
            ", typePersonnel='" + getTypePersonnel() + "'" +
            ", dateDeNaissance='" + getDateDeNaissance() + "'" +
            ", lieuNaissance='" + getLieuNaissance() + "'" +
            ", nationalite='" + getNationalite() + "'" +
            ", email='" + getEmail() + "'" +
            ", adresse='" + getAdresse() + "'" +
            ", externe='" + getExterne() + "'" +
            ", actif='" + getActif() + "'" +
            ", role='" + getRole() + "'" +
            ", dateHeureModification='" + getDateHeureModification() + "'" +
            ", dateHeureCreation='" + getDateHeureCreation() + "'" +
            ", modifiedBy='" + getModifiedBy() + "'" +
            ", createdBy='" + getCreatedBy() + "'" +
            "}";
    }
}
