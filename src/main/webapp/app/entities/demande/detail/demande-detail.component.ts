import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IDemande } from '../demande.model';
import { DemandeService } from '../service/demande.service';
import { CaisseService } from 'app/entities/caisse/service/caisse.service';
import { ICaisse, NewCaisse } from 'app/entities/caisse/caisse.model';
import { EtatCaisse } from 'app/entities/enumerations/etat-caisse.model';
import { Objet } from 'app/entities/enumerations/objet.model';
import { FormsModule } from '@angular/forms';
import dayjs from 'dayjs/esm';

@Component({
  standalone: true,
  selector: 'jhi-demande-detail',
  templateUrl: './demande-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe, FormsModule],
})
export class DemandeDetailComponent {
  @Input() demande: IDemande | null = null;

  showModal = false;
  showModalTraitement = false;
  motifRefus = '';
  caisses: ICaisse[] = [];

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected demandeService: DemandeService,
    protected caisseService: CaisseService,
  ) {}

  // Ouvre le modal de traitement
  ouvrirModalTraitement() {
    this.showModalTraitement = true;
  }

  // Ferme le modal de traitement
  fermerModalTraitement() {
    this.showModalTraitement = false;
  }

  // Ouvre le modal de refus depuis le modal de traitement
  ouvrirModalRefusDepuisTraitement() {
    this.showModalTraitement = false;
    this.showModal = true;
  }

  previousState(): void {
    window.history.back();
  }

  ouvrirModalRefus() {
    this.showModal = true;
  }

  fermerModal() {
    this.showModal = false;
    this.motifRefus = '';
  }

  traiter(accepte: boolean) {
    if (!this.demande) {
      return;
    }

    // Si refus, on exige le motif
    if (!accepte && !this.motifRefus) {
      alert('Le motif est obligatoire pour refuser.');
      return;
    }

    // Appel du service pour traiter la demande
    this.demandeService.traiterDemande(this.demande.id, accepte, this.motifRefus).subscribe({
      next: (res: IDemande) => {
        alert('Traitement effectué !');
        this.demande = res;
        // La création automatique de la caisse est gérée côté backend uniquement
        // Clôture automatique de la caisse si demande acceptée et objet CLOTURE_CAISSE
        if (accepte && this.demande.objet === Objet.CLOTURE_CAISSE && this.demande.etablissement) {
          // Il faut récupérer la caisse liée à l'établissement et la clôturer
          // Ici, on suppose qu'il existe une méthode pour récupérer la caisse par établissement
          this.caisseService.query({ 'etablissementId.equals': this.demande.etablissement.id }).subscribe({
            next: response => {
              const caisse = response.body && response.body.length > 0 ? response.body[0] : null;
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
        // Alimentation automatique de la caisse si demande acceptée et objet ALIMENTATION_CAISSE
        if (accepte && this.demande.objet === Objet.ALIMENTATION_CAISSE && this.demande.etablissement) {
          // Il faut récupérer la caisse liée à l'établissement et alimenter le solde
          // On suppose que le montant est dans demande.montant
          const montant = Number(this.demande.montant);
          if (!isNaN(montant) && montant > 0) {
            this.caisseService.query({ 'etablissementId.equals': this.demande.etablissement.id }).subscribe({
              next: response => {
                const caisse = response.body && response.body.length > 0 ? response.body[0] : null;
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
        }
        this.fermerModal();
        this.fermerModalTraitement();
      },
      error: (err: any) => alert('Erreur lors du traitement'),
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
}
