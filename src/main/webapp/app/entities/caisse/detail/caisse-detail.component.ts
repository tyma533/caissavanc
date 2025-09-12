import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { ICaisse } from '../caisse.model';
import { IRubrique } from 'app/entities/rubrique/rubrique.model';
import { CaisseService } from 'app/entities/caisse/service/caisse.service';
import { FormsModule } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { OperationService } from 'app/entities/operation/service/operation.service';

@Component({
  standalone: true,
  selector: 'jhi-caisse-detail',
  templateUrl: './caisse-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe, FormsModule],
  styles: [
    `
      .rubriques-container {
        display: flex;
        j-gap: 20px;
        align-items: flex-start;
      }
      .rubriques-list {
        border: 1px solid #ccc;
        padding: 10px;
        width: 250px;
        height: 300px;
        overflow-y: auto;
      }
      .rubriques-actions {
        display: flex;
        flex-direction: column;
        gap: 10px;
        justify-content: center;
        align-items: center;
      }
    `,
  ],
})
export class CaisseDetailComponent {
  @Input() caisse: ICaisse | null = null;
  rubriquesAffectees: IRubrique[] = [];
  rubriquesNonAffectees: IRubrique[] = [];
  modeOperationId: number = 1;
  montant: number = 0;
  commentaire: string = '';

  constructor(
    protected activatedRoute: ActivatedRoute,
    private caisseService: CaisseService,
    private operationService: OperationService,
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID de la caisse depuis la route si nécessaire
    this.activatedRoute.params.subscribe(params => {
      const caisseId = +params['id'];
      this.loadCaisse(caisseId);
      this.loadRubriques(caisseId);
    });
  }

  loadCaisse(caisseId: number): void {
    this.caisseService.getCaisse(caisseId).subscribe(caisse => (this.caisse = caisse));
  }

  // loadRubriques(caisseId: number): void {
  //   this.caisseService.getRubriquesAffectees(caisseId).subscribe(data => (this.rubriquesAffectees = data));
  //   this.caisseService.getRubriquesNonAffectees(caisseId).subscribe(data => (this.rubriquesNonAffectees = data));
  // }

  loadRubriques(caisseId: number): void {
    this.caisseService.getRubriquesAffectees(caisseId).subscribe((data: IRubrique[]) => {
      // Ajouter selected = false pour chaque rubrique
      this.rubriquesAffectees = data.map(r => ({ ...r, selected: false }));
    });

    this.caisseService.getRubriquesNonAffectees(caisseId).subscribe((data: IRubrique[]) => {
      // Ajouter selected = false pour chaque rubrique
      this.rubriquesNonAffectees = data.map(r => ({ ...r, selected: false }));
    });
  }

  // affecterSelected(): void {
  //   const selected = this.rubriquesNonAffectees.filter(r => r.selected);
  //   console.log('Caisse ID:', this.caisse!.id);
  //   selected.forEach(r => console.log('Rubrique ID:', r.id));
  // }

  affecterSelected(): void {
    const selected = this.rubriquesNonAffectees.filter(r => r.selected);

    if (selected.length === 0) return; // rien à affecter

    // Crée un tableau d'observables pour chaque requête
    const requests = selected.map(r => this.caisseService.affecterRubrique(this.caisse!.id!, r.id!));
    console.log('Caisse ID:', this.caisse!.id);
    // Attendre que toutes les requêtes soient terminées
    forkJoin(requests).subscribe(() => {
      this.loadRubriques(this.caisse!.id!); // recharge les rubriques après l'affectation
    });
  }

  desaffecterSelected(): void {
    const selected = this.rubriquesAffectees.filter(r => r.selected);

    if (selected.length === 0) return;

    const requests = selected.map(r => this.caisseService.desaffecterRubrique(this.caisse!.id!, r.id!));
    console.log('Caisse ID:', this.caisse!.id);
    forkJoin(requests).subscribe(() => {
      this.loadRubriques(this.caisse!.id!); // recharge les rubriques après désaffectation
    });
  }

  effectuerDepense(): void {
    if (!this.caisse?.id) {
      alert('Aucune caisse sélectionnée');
      return;
    }

    this.operationService.effectuerDepense(this.caisse.id, this.montant, this.commentaire, this.modeOperationId).subscribe({
      next: res => {
        alert('Dépense effectuée avec succès ! ✅');
        console.log(res);
      },
      error: err => {
        alert("Erreur lors de l'enregistrement de la dépense ❌");
        console.error(err);
      },
    });
  }

  previousState(): void {
    window.history.back();
  }
}
