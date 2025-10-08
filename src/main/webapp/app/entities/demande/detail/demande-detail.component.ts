import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import SharedModule from 'app/shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';

import { IDemande } from '../demande.model';
import { DemandeService } from '../service/demande.service';
import { CaisseService } from 'app/entities/caisse/service/caisse.service';
import { ICaisse } from 'app/entities/caisse/caisse.model';
import { EnumTypeLabels, Type } from 'app/entities/enumerations/type.model';
import { IModeOperation } from 'app/entities/mode-operation/mode-operation.model';
import { ModeOperationService } from 'app/entities/mode-operation/service/mode-operation.service';
import { EtatCaisse } from 'app/entities/enumerations/etat-caisse.model';
import { IOperation } from 'app/entities/operation/operation.model';
import { TYPEALIMENTATIONCAISSEEXECUTION, TYPEALIMENTATIONCAISSEVALIDATION } from 'app/app.constants';
import { EtatDemande } from 'app/entities/enumerations/etat-demande';

@Component({
  selector: 'jhi-demande-detail',
  templateUrl: './demande-detail.component.html',
  styleUrls: ['./demande-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SharedModule,
    FontAwesomeModule,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
  ],
})
export class DemandeDetailComponent implements OnInit {
  @Input() demande: IDemande | null = null;

  showModalTraitement = false;
  motifRefus = '';
  caisses: ICaisse[] = [];
  modeOperations: IModeOperation[] = [];
  selectedModeOperationId: number | null = null;
  EnumTypeLabels = EnumTypeLabels;
  typeAlimentationCaisse?: string;
  showModalDFC: boolean = false;
  showModalComptable: boolean = false;

  TYPEALIMENTATIONCAISSEVALIDATION = TYPEALIMENTATIONCAISSEVALIDATION;
  TYPEALIMENTATIONCAISSEEXECUTION = TYPEALIMENTATIONCAISSEEXECUTION;
  ETATVALIDEE = EtatDemande.VALIDEE_DFC;

  TYPEALIMENTATIONCAISSE = Type.ALIMENTATION_CAISSE;
  TYPECLOTURECAISSE = Type.CLOTURE_CAISSE;
  TYPEREOUVERTURECAISSE = Type.REOUVERTURE_CAISSE;

  operationDTO: IOperation = {
    modeOperation: null,
    montant: 0,
    banque: '',
    numeroVC: '',
    beneficiaire: '',
    crediteur: '',
  };

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected demandeService: DemandeService,
    protected caisseService: CaisseService,
    protected modeOperationService: ModeOperationService,
    protected router: Router,
  ) {}

  ngOnInit(): void {
    this.modeOperationService.query().subscribe({
      next: res => (this.modeOperations = res.body ?? []),
      error: () => alert('Erreur lors de la récupération des modes d’opération'),
    });

    if (this.demande?.etablissement?.id) {
      this.onEtablissementChange(this.demande.etablissement.id);
    }
  }

  ouvrirModalTraitement(typeAlimentationCaisse?: string): void {
    if (!typeAlimentationCaisse) return;

    this.typeAlimentationCaisse = typeAlimentationCaisse;

    switch (typeAlimentationCaisse) {
      case TYPEALIMENTATIONCAISSEVALIDATION:
        this.showModalDFC = true;
        this.operationDTO.montant = this.demande?.montant ?? 0;
        break;

      case TYPEALIMENTATIONCAISSEEXECUTION:
        this.showModalComptable = true;
        this.operationDTO.montant = this.demande?.montantAccorde ?? 0;
        break;

      default: // Création, clôture, réouverture
        this.showModalTraitement = true;
        break;
    }
  }

  fermerModalTraitement(): void {
    this.showModalTraitement = false;
  }

  isDemandeTraitee(): boolean {
    return this.demande?.etat !== 'EN_ATTENTE';
  }

  // traiter(accepte: boolean): void {
  //   if (!this.demande) return;

  //   if (!accepte && !this.motifRefus) {
  //     alert('Le motif est obligatoire pour refuser.');
  //     return;
  //   }

  //   if (accepte && this.demande.type === Type.ALIMENTATION_CAISSE && !this.selectedModeOperationId) {
  //     alert('Veuillez sélectionner un mode d’opération avant d’accepter cette alimentation.');
  //     return;
  //   }

  //   this.operationDTO.modeOperation = this.modeOperations.find(m => m.id === this.selectedModeOperationId);

  //   this.demandeService.traiterDemande(
  //     this.demande.id!,
  //     accepte,
  //     this.motifRefus,
  //     this.operationDTO
  //   ).subscribe({
  //     next: res => {
  //       alert('Traitement effectué !');
  //       this.demande = { ...res, etat: 'TRAITEE' };
  //       this.fermerModalTraitement();

  //       if (accepte && this.demande.type === Type.ALIMENTATION_CAISSE && this.demande.etablissement) {
  //         this.alimenterCaisse(this.demande.etablissement.id, Number(this.demande.montant));
  //       }

  //       if (accepte && this.demande.type === Type.CLOTURE_CAISSE && this.demande.etablissement) {
  //         this.cloturerCaisse(this.demande.etablissement.id);
  //       }

  //       this.router.navigate(['/caisse']);
  //     },
  //     error: () => alert('Erreur lors du traitement de la demande')
  //   });
  // }

  traiter(accepte: boolean): void {
    if (!this.demande) return;

    // Vérifier le motif en cas de refus
    if (!accepte && !this.motifRefus) {
      alert('Le motif est obligatoire pour refuser.');
      return;
    }

    // Vérifier le mode d'opération si c'est une alimentation
    if (accepte && this.demande.type === 'ALIMENTATION_CAISSE') {
      if (!this.operationDTO.modeOperation) {
        alert('Veuillez sélectionner un mode d’opération avant d’accepter cette alimentation');
        return;
      }
      if (!this.operationDTO.montant || this.operationDTO.montant <= 0) {
        alert('Veuillez saisir un montant valide.');
        return;
      }
    }

    // Appel du service pour traiter la demande
    this.demandeService.traiterDemande(this.demande.id!, accepte, this.motifRefus, this.operationDTO).subscribe({
      next: res => {
        alert('Traitement effectué !');
        this.demande = { ...res, etat: 'TRAITEE' };
        this.fermerModalTraitement();
      },
      error: () => alert('Erreur lors du traitement de la demande'),
    });
  }

  onEtablissementChange(etablissementId: number): void {
    this.caisseService.findByEtablissementId(etablissementId).subscribe({
      next: res => (this.caisses = res),
      error: () => alert('Erreur lors de la récupération des caisses'),
    });
  }

  private alimenterCaisse(etablissementId: number, montant: number): void {
    if (!montant || montant <= 0) return;

    this.caisseService.findByEtablissementId(etablissementId).subscribe({
      next: res => {
        const caisse = res[0];
        if (caisse) {
          const updatedCaisse = { ...caisse, solde: (caisse.solde || 0) + montant };
          this.caisseService.update(updatedCaisse).subscribe({
            next: () => alert('Caisse alimentée automatiquement !'),
            error: () => alert("Erreur lors de l'alimentation de la caisse"),
          });
        }
      },
      error: () => alert('Erreur lors de la récupération de la caisse pour alimentation'),
    });
  }

  private cloturerCaisse(etablissementId: number): void {
    this.caisseService.findByEtablissementId(etablissementId).subscribe({
      next: res => {
        const caisse = res[0];
        if (caisse) {
          const updatedCaisse = { ...caisse, etat: EtatCaisse.CLOTURE };
          this.caisseService.update(updatedCaisse).subscribe({
            next: () => alert('Caisse clôturée automatiquement !'),
            error: () => alert('Erreur lors de la clôture de la caisse'),
          });
        }
      },
      error: () => alert('Erreur lors de la récupération de la caisse pour clôture'),
    });
  }

  // Modal refus
  showModal = false;
  ouvrirModalRefusDepuisTraitement(): void {
    this.showModal = true;
  }
  fermerModal(): void {
    this.showModal = false;
  }

  previousState(): void {
    window.history.back();
  }
  // --- méthode pour ouvrir la modale DFC ---
  ouvrirModalDFC(): void {
    this.showModalDFC = true;
  }

  // --- méthode pour fermer la modale DFC ---
  fermerModalDFC(): void {
    this.showModalDFC = false;
  }

  // --- méthode pour valider le montant accordé par le DFC ---
  validerMontantAccorde(): void {
    if (!this.demande?.montantAccorde || this.demande.montantAccorde <= 0) {
      alert('Veuillez saisir un montant valide');
      return;
    }

    if (!this.demande) return;

    const updatedDemande: any = {
      ...this.demande, // copie tous les champs existants
      montantAccorde: this.demande.montantAccorde,
      etat: 'VALIDEE_DFC',
    };

    this.demandeService.updateDemande(this.demande.id!, updatedDemande).subscribe({
      next: updated => {
        this.demande = updated;
        this.showModalDFC = false;
        alert('Montant accordé enregistré avec succès');
      },
      error: () => alert('Erreur lors de l’enregistrement du montant accordé'),
    });
  }

  // --- méthode pour ouvrir la modale agent comptable ---
  ouvrirModalComptable(): void {
    this.showModalComptable = true;
  }

  // --- méthode pour fermer la modale agent comptable ---
  fermerModalComptable(): void {
    this.showModalComptable = false;
  }

  // --- méthode pour exécuter l'alimentation de la caisse ---
  executerAlimentation(): void {
    if (!this.operationDTO.montant || !this.operationDTO.modeOperation) {
      alert('Veuillez saisir le montant et le mode d’opération');
      return;
    }

    if (!this.demande) return;

    this.demandeService.executerAlimentation(this.demande.id!, this.operationDTO).subscribe({
      next: res => {
        this.demande = res;
        this.showModalComptable = false;
        alert('Alimentation enregistrée avec succès !');
      },
      error: () => alert('Erreur lors de l’alimentation de la caisse'),
    });
  }
}
