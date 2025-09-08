import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { IDemande } from '../demande.model';
import { DemandeService } from '../service/demande.service';
import { CaisseService } from 'app/entities/caisse/service/caisse.service';
import { EtatCaisse } from 'app/entities/enumerations/etat-caisse.model';
import { Objet } from 'app/entities/enumerations/objet.model';
import { CommonModule } from '@angular/common';
import SharedModule from 'app/shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';

@Component({
  standalone: true,
  selector: 'jhi-demande-detail',
  templateUrl: './demande-detail.component.html',
  imports: [
    RouterModule,
    FormsModule,
    CommonModule,
    SharedModule,
    FontAwesomeModule,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
  ],
})
export class DemandeDetailComponent {
  @Input() demande: IDemande | null = null;

  showModal = false;
  showModalTraitement = false;
  motifRefus = '';

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected demandeService: DemandeService,
    protected caisseService: CaisseService,
  ) {}

  // Modals
  ouvrirModalTraitement() {
    this.showModalTraitement = true;
  }
  fermerModalTraitement() {
    this.showModalTraitement = false;
  }
  ouvrirModalRefusDepuisTraitement() {
    this.showModalTraitement = false;
    this.showModal = true;
  }
  ouvrirModalRefus() {
    this.showModal = true;
  }
  fermerModal() {
    this.showModal = false;
    this.motifRefus = '';
  }

  previousState(): void {
    window.history.back();
  }

  // Traitement de la demande
  traiter(accepte: boolean) {
    if (!this.demande) return;

    if (!accepte && !this.motifRefus) {
      alert('Le motif est obligatoire pour refuser.');
      return;
    }

    // Appel au service avec query params
    this.demandeService.traiter(this.demande.id, accepte, !accepte ? this.motifRefus : undefined).subscribe({
      next: res => {
        if (!res.body) return;
        this.demande = res.body;
        alert('Traitement effectué !');

        if (!this.demande.etablissement) return;

        // Récupérer la caisse associée à l'établissement
        this.caisseService.query({ 'etablissementId.equals': this.demande.etablissement.id }).subscribe({
          next: response => {
            const caisse = response.body?.[0];
            if (!caisse) return;

            // Clôture de la caisse
            if (accepte && this.demande?.objet === Objet.CLOTURE_CAISSE) {
              const updatedCaisse = { ...caisse, etat: EtatCaisse.CLOTURE };
              this.caisseService.update(updatedCaisse).subscribe({
                next: () => alert('Caisse clôturée automatiquement !'),
                error: () => alert('Erreur lors de la clôture de la caisse'),
              });
            }

            // Alimentation de la caisse
            if (accepte && this.demande?.objet === Objet.ALIMENTATION_CAISSE) {
              const montant = Number(this.demande?.montant || 0);
              if (montant > 0) {
                const updatedCaisse = { ...caisse, solde: (caisse.solde || 0) + montant };
                this.caisseService.update(updatedCaisse).subscribe({
                  next: () => alert('Caisse alimentée automatiquement !'),
                  error: () => alert("Erreur lors de l'alimentation de la caisse"),
                });
              }
            }
          },
          error: () => alert('Erreur lors de la récupération de la caisse'),
        });

        this.fermerModal();
        this.fermerModalTraitement();
      },
      error: () => alert('Erreur lors du traitement'),
    });
  }

  // Actions rapides pour boutons
  accepterDemande() {
    this.traiter(true);
  }
  refuserDemande(motif: string) {
    this.motifRefus = motif;
    this.traiter(false);
  }
}
