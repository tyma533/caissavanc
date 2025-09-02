package com.mycompany.myapp.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Agent.
 */
@Entity
@Table(name = "agent")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Agent implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "code_matrile", nullable = false, unique = true)
    private String codeMatrile;

    @NotNull
    @Size(max = 20)
    @Column(name = "cni", length = 20, nullable = false)
    private String cni;

    @Column(name = "statut_agent")
    private String statutAgent;

    @Column(name = "nom")
    private String nom;

    @Column(name = "prenom")
    private String prenom;

    @Column(name = "sexe")
    private String sexe;

    @NotNull
    @Column(name = "email_ucad", nullable = false)
    private String emailUcad;

    @Column(name = "telephone")
    private String telephone;

    @Column(name = "fonction_agent")
    private String fonctionAgent;

    @Column(name = "type_personnel")
    private String typePersonnel;

    @Column(name = "date_de_naissance")
    private LocalDate dateDeNaissance;

    @Column(name = "lieu_naissance")
    private String lieuNaissance;

    @Column(name = "nationalite")
    private String nationalite;

    @Column(name = "email")
    private String email;

    @Column(name = "adresse")
    private String adresse;

    @Column(name = "externe")
    private Boolean externe;

    @Column(name = "actif")
    private Boolean actif;

    @Column(name = "role")
    private String role;

    @Column(name = "date_heure_modification")
    private Instant dateHeureModification;

    @Column(name = "date_heure_creation")
    private Instant dateHeureCreation;

    @Column(name = "modified_by")
    private String modifiedBy;

    @Column(name = "created_by")
    private String createdBy;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Agent id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodeMatrile() {
        return this.codeMatrile;
    }

    public Agent codeMatrile(String codeMatrile) {
        this.setCodeMatrile(codeMatrile);
        return this;
    }

    public void setCodeMatrile(String codeMatrile) {
        this.codeMatrile = codeMatrile;
    }

    public String getCni() {
        return this.cni;
    }

    public Agent cni(String cni) {
        this.setCni(cni);
        return this;
    }

    public void setCni(String cni) {
        this.cni = cni;
    }

    public String getStatutAgent() {
        return this.statutAgent;
    }

    public Agent statutAgent(String statutAgent) {
        this.setStatutAgent(statutAgent);
        return this;
    }

    public void setStatutAgent(String statutAgent) {
        this.statutAgent = statutAgent;
    }

    public String getNom() {
        return this.nom;
    }

    public Agent nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return this.prenom;
    }

    public Agent prenom(String prenom) {
        this.setPrenom(prenom);
        return this;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getSexe() {
        return this.sexe;
    }

    public Agent sexe(String sexe) {
        this.setSexe(sexe);
        return this;
    }

    public void setSexe(String sexe) {
        this.sexe = sexe;
    }

    public String getEmailUcad() {
        return this.emailUcad;
    }

    public Agent emailUcad(String emailUcad) {
        this.setEmailUcad(emailUcad);
        return this;
    }

    public void setEmailUcad(String emailUcad) {
        this.emailUcad = emailUcad;
    }

    public String getTelephone() {
        return this.telephone;
    }

    public Agent telephone(String telephone) {
        this.setTelephone(telephone);
        return this;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getFonctionAgent() {
        return this.fonctionAgent;
    }

    public Agent fonctionAgent(String fonctionAgent) {
        this.setFonctionAgent(fonctionAgent);
        return this;
    }

    public void setFonctionAgent(String fonctionAgent) {
        this.fonctionAgent = fonctionAgent;
    }

    public String getTypePersonnel() {
        return this.typePersonnel;
    }

    public Agent typePersonnel(String typePersonnel) {
        this.setTypePersonnel(typePersonnel);
        return this;
    }

    public void setTypePersonnel(String typePersonnel) {
        this.typePersonnel = typePersonnel;
    }

    public LocalDate getDateDeNaissance() {
        return this.dateDeNaissance;
    }

    public Agent dateDeNaissance(LocalDate dateDeNaissance) {
        this.setDateDeNaissance(dateDeNaissance);
        return this;
    }

    public void setDateDeNaissance(LocalDate dateDeNaissance) {
        this.dateDeNaissance = dateDeNaissance;
    }

    public String getLieuNaissance() {
        return this.lieuNaissance;
    }

    public Agent lieuNaissance(String lieuNaissance) {
        this.setLieuNaissance(lieuNaissance);
        return this;
    }

    public void setLieuNaissance(String lieuNaissance) {
        this.lieuNaissance = lieuNaissance;
    }

    public String getNationalite() {
        return this.nationalite;
    }

    public Agent nationalite(String nationalite) {
        this.setNationalite(nationalite);
        return this;
    }

    public void setNationalite(String nationalite) {
        this.nationalite = nationalite;
    }

    public String getEmail() {
        return this.email;
    }

    public Agent email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAdresse() {
        return this.adresse;
    }

    public Agent adresse(String adresse) {
        this.setAdresse(adresse);
        return this;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public Boolean getExterne() {
        return this.externe;
    }

    public Agent externe(Boolean externe) {
        this.setExterne(externe);
        return this;
    }

    public void setExterne(Boolean externe) {
        this.externe = externe;
    }

    public Boolean getActif() {
        return this.actif;
    }

    public Agent actif(Boolean actif) {
        this.setActif(actif);
        return this;
    }

    public void setActif(Boolean actif) {
        this.actif = actif;
    }

    public String getRole() {
        return this.role;
    }

    public Agent role(String role) {
        this.setRole(role);
        return this;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Instant getDateHeureModification() {
        return this.dateHeureModification;
    }

    public Agent dateHeureModification(Instant dateHeureModification) {
        this.setDateHeureModification(dateHeureModification);
        return this;
    }

    public void setDateHeureModification(Instant dateHeureModification) {
        this.dateHeureModification = dateHeureModification;
    }

    public Instant getDateHeureCreation() {
        return this.dateHeureCreation;
    }

    public Agent dateHeureCreation(Instant dateHeureCreation) {
        this.setDateHeureCreation(dateHeureCreation);
        return this;
    }

    public void setDateHeureCreation(Instant dateHeureCreation) {
        this.dateHeureCreation = dateHeureCreation;
    }

    public String getModifiedBy() {
        return this.modifiedBy;
    }

    public Agent modifiedBy(String modifiedBy) {
        this.setModifiedBy(modifiedBy);
        return this;
    }

    public void setModifiedBy(String modifiedBy) {
        this.modifiedBy = modifiedBy;
    }

    public String getCreatedBy() {
        return this.createdBy;
    }

    public Agent createdBy(String createdBy) {
        this.setCreatedBy(createdBy);
        return this;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Agent)) {
            return false;
        }
        return getId() != null && getId().equals(((Agent) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Agent{" +
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
