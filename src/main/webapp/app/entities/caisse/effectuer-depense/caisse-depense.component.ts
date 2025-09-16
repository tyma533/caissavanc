import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CaisseService } from '../service/caisse.service';
import { OperationService } from 'app/entities/operation/service/operation.service';
import { ICaisse } from '../caisse.model';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'jhi-caisse-depense',
  templateUrl: './caisse-depense.component.html',
  imports: [FormsModule, RouterModule, CommonModule],
})
export class CaisseDepenseComponent {
  caisse: ICaisse | null = null;
  montant: number = 0;
  commentaire: string = '';
  modeOperationId: number = 1;

  constructor(
    private activatedRoute: ActivatedRoute,
    private operationService: OperationService,
    private caisseService: CaisseService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const caisseId = +params['id'];
      this.caisseService.getCaisse(caisseId).subscribe(c => (this.caisse = c));
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
}
