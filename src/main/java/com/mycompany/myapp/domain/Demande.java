package com.mycompany.myapp.domain;

import com.mycompany.myapp.domain.enumeration.EtatDemande;
import com.mycompany.myapp.domain.enumeration.Objet;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Demande.
 */
@Entity
@Table(name = "demande")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Demande implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "objet", nullable = false)
    private Objet objet;

    @Column(name = "date_demande")
    private Instant dateDemande;

    @Column(name = "motif")
    private String motif;

    @Column(name = "date_heure_modification")
    private Instant dateHeureModification;

    @Column(name = "date_heure_creation")
    private Instant dateHeureCreation;

    @Column(name = "uti_cree")
    private Long utiCree;

    @Column(name = "uti_modifie")
    private Long utiModifie;

    @Column(name = "libelle")
    private String libelle;

    @Column(name = "montant")
    private Long montant;

    @Column(name = "commentaire")
    private String commentaire;

    @Column(name = "caisse_id")
    private Long caisseId;

    @ManyToOne(fetch = FetchType.EAGER)
    private Etablissement etablissement;

    @ManyToOne
    @JoinColumn(name = "mode_operation_id")
    private ModeOperation modeOperation;

    @ManyToOne
    @JoinColumn(name = "type_operation_id")
    private TypeOperation typeOperation;

    @ManyToOne
    @JoinColumn(name = "caisse_id", insertable = false, updatable = false)
    private Caisse caisse;

    @Enumerated(EnumType.STRING)
    private EtatDemande etat;

    // Getter et Setter
    public Caisse getCaisse() {
        return caisse;
    }

    public void setCaisse(Caisse caisse) {
        this.caisse = caisse;
    }

    // Getters et setters

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Objet getObjet() {
        return this.objet;
    }

    public void setObjet(Objet objet) {
        this.objet = objet;
    }

    public Instant getDateDemande() {
        return this.dateDemande;
    }

    public void setDateDemande(Instant dateDemande) {
        this.dateDemande = dateDemande;
    }

    public String getMotif() {
        return this.motif;
    }

    public void setMotif(String motif) {
        this.motif = motif;
    }

    public String getLibelle() {
        return this.libelle;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public Long getMontant() {
        return this.montant;
    }

    public void setMontant(Long montant) {
        this.montant = montant;
    }

    public Instant getDateHeureModification() {
        return this.dateHeureModification;
    }

    public void setDateHeureModification(Instant dateHeureModification) {
        this.dateHeureModification = dateHeureModification;
    }

    public Instant getDateHeureCreation() {
        return this.dateHeureCreation;
    }

    public void setDateHeureCreation(Instant dateHeureCreation) {
        this.dateHeureCreation = dateHeureCreation;
    }

    public Long getUtiCree() {
        return this.utiCree;
    }

    public void setUtiCree(Long utiCree) {
        this.utiCree = utiCree;
    }

    public Long getUtiModifie() {
        return this.utiModifie;
    }

    public void setUtiModifie(Long utiModifie) {
        this.utiModifie = utiModifie;
    }

    public Long getCaisseId() {
        return this.caisseId;
    }

    public void setCaisseId(Long caisseId) {
        this.caisseId = caisseId;
    }

    public Etablissement getEtablissement() {
        return this.etablissement;
    }

    public void setEtablissement(Etablissement etablissement) {
        this.etablissement = etablissement;
    }

    public ModeOperation getModeOperation() {
        return this.modeOperation;
    }

    public void setModeOperation(ModeOperation modeOperation) {
        this.modeOperation = modeOperation;
    }

    public TypeOperation getTypeOperation() {
        return this.typeOperation;
    }

    public void setTypeOperation(TypeOperation typeOperation) {
        this.typeOperation = typeOperation;
    }

    public String getCommentaire() {
        return commentaire;
    }

    public void setCommentaire(String commentaire) {
        this.commentaire = commentaire;
    }

    public EtatDemande getEtat() {
        return this.etat;
    }

    public void setEtat(EtatDemande etat) {
        this.etat = etat;
    }

    // equals, hashCode et toString

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Demande)) {
            return false;
        }
        return getId() != null && getId().equals(((Demande) o).getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return (
            "Demande{" +
            "id=" +
            getId() +
            ", objet='" +
            getObjet() +
            "'" +
            ", dateDemande='" +
            getDateDemande() +
            "'" +
            ", motif='" +
            getMotif() +
            "'" +
            ", dateHeureModification='" +
            getDateHeureModification() +
            "'" +
            ", dateHeureCreation='" +
            getDateHeureCreation() +
            "'" +
            ", utiCree=" +
            getUtiCree() +
            ", utiModifie=" +
            getUtiModifie() +
            ", libelle='" +
            getLibelle() +
            "'" +
            ", montant=" +
            getMontant() +
            ", caisseId=" +
            getCaisseId() +
            "}"
        );
    }

    public Object id(long incrementAndGet) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'id'");
    }
}
