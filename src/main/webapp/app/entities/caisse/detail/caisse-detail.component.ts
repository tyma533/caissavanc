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
import { IOperation } from 'app/entities/operation/operation.model';
@Component({
  standalone: true,
  selector: 'jhi-caisse-detail',
  templateUrl: './caisse-detail.component.html',
  styleUrls: ['./caisse-detail.component.scss'],
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe, FormsModule],
})
export class CaisseDetailComponent {
  @Input() caisse: ICaisse | null = null;
  rubriquesAffectees: IRubrique[] = [];
  rubriquesNonAffectees: IRubrique[] = [];
  modeOperationId: number = 1;
  montant: number = 0;
  commentaire: string = '';
  operations: IOperation[] = [];
  isCaisseFermee = false;

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
    });

    this.activatedRoute.data.subscribe(({ caisse }) => {
      this.caisse = caisse;
      if (caisse.id) {
        this.loadOperations(caisse.id);
      }
    });
  }

  loadCaisse(caisseId: number): void {
    this.caisseService.getCaisse(caisseId).subscribe(
      caisse => {
        this.caisse = caisse;

        // Vérifier si la caisse est clôturée
        this.isCaisseFermee = this.caisse?.etat === 'CLOTURE';

        // Charger les opérations seulement si la caisse est ouverte
        if (!this.isCaisseFermee && this.caisse?.id) {
          this.loadOperations(this.caisse.id);
        }
      },
      error => {
        alert('Erreur lors du chargement de la caisse');
      },
    );
  }

  loadOperations(caisseId: number): void {
    this.operationService.findByCaisse(caisseId).subscribe({
      next: res => (this.operations = res),
      error: () => alert('Erreur lors du chargement des opérations'),
    });
  }

  // loadRubriques(caisseId: number): void {
  //   this.caisseService.getRubriquesAffectees(caisseId).subscribe(data => (this.rubriquesAffectees = data));
  //   this.caisseService.getRubriquesNonAffectees(caisseId).subscribe(data => (this.rubriquesNonAffectees = data));
  // }

  // affecterSelected(): void {
  //   const selected = this.rubriquesNonAffectees.filter(r => r.selected);
  //   console.log('Caisse ID:', this.caisse!.id);
  //   selected.forEach(r => console.log('Rubrique ID:', r.id));
  // }

  previousState(): void {
    window.history.back();
  }
}
