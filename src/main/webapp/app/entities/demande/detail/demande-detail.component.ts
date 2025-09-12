import { Component, Input, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IDemande } from '../demande.model';
import { DemandeService } from '../service/demande.service';
import { CaisseService } from 'app/entities/caisse/service/caisse.service';
import { ICaisse } from 'app/entities/caisse/caisse.model';
import { Objet } from 'app/entities/enumerations/objet.model';
import { IModeOperation } from 'app/entities/mode-operation/mode-operation.model';
import { ModeOperationService } from 'app/entities/mode-operation/service/mode-operation.service';
import { EtatCaisse } from 'app/entities/enumerations/etat-caisse.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FaIconComponent, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';

@Component({
  selector: 'jhi-demande-detail',
  templateUrl: './demande-detail.component.html',
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
    FontAwesomeModule,
  ],
})
export class DemandeDetailComponent implements OnInit {
  @Input() demande: IDemande | null = null;

  showModalTraitement = false;
  motifRefus = '';
  caisses: ICaisse[] = [];
  modeOperations: IModeOperation[] = [];
  selectedModeOperationId: number | null = null;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected demandeService: DemandeService,
    protected caisseService: CaisseService,
    protected modeOperationService: ModeOperationService,
  ) {}

  ngOnInit(): void {
    // Charger les modes d'opération pour l'alimentation
    this.modeOperationService.query().subscribe({
      next: res => {
        this.modeOperations = res.body ?? [];
      },
      error: () => alert('Erreur lors de la récupération des modes d’opération'),
    });

    // Charger les caisses si un établissement est lié
    if (this.demande?.etablissement?.id) {
      this.onEtablissementChange(this.demande.etablissement.id);
    }
  }

  ouvrirModalTraitement(): void {
    this.showModalTraitement = true;
  }

  fermerModalTraitement(): void {
    this.showModalTraitement = false;
  }

  traiter(accepte: boolean): void {
    if (!this.demande) return;

    // Vérifier le motif en cas de refus
    if (!accepte && !this.motifRefus) {
      alert('Le motif est obligatoire pour refuser.');
      return;
    }

    // // Vérifier le mode d'opération en cas d'alimentation
    // if (accepte && this.demande.objet === Objet.ALIMENTATION_CAISSE && !this.selectedModeOperationId) {
    //   alert('Veuillez sélectionner un mode d’opération avant d’accepter cette alimentation.');
    //   return;
    // }

    // Forcer "VIREMENT" pour les alimentations cochées

    const modeOperationId = this.selectedModeOperationId ?? null;

    // Appel backend pour traiter la demande
    this.demandeService.traiterDemande(this.demande.id!, accepte, this.motifRefus, modeOperationId).subscribe({
      next: res => {
        alert('Traitement effectué !');
        this.demande = res;
        this.fermerModalTraitement();

        // Mise à jour automatique de la caisse pour alimentation
        if (accepte && this.demande.objet === Objet.ALIMENTATION_CAISSE && this.demande.etablissement) {
          this.alimenterCaisse(this.demande.etablissement.id, Number(this.demande.montant));
        }

        // Clôture automatique pour clôture de caisse
        if (accepte && this.demande.objet === Objet.CLOTURE_CAISSE && this.demande.etablissement) {
          this.cloturerCaisse(this.demande.etablissement.id);
        }
      },
      error: () => alert('Erreur lors du traitement de la demande'),
    });
  }

  onEtablissementChange(etablissementId: number): void {
    this.caisseService.findByEtablissementId(etablissementId).subscribe({
      next: res => {
        this.caisses = res;
      },
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

  // Ajoute dans DemandeDetailComponent

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
}
