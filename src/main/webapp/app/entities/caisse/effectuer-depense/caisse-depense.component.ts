import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CaisseService } from '../service/caisse.service';
import { OperationService } from 'app/entities/operation/service/operation.service';
import { ICaisse } from '../caisse.model';
import { CommonModule } from '@angular/common';
import { IOperation } from 'app/entities/operation/operation.model';
import { EtatCaisse } from 'app/entities/enumerations/etat-caisse.model';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'jhi-caisse-depense',
  templateUrl: './caisse-depense.component.html',
  styleUrls: ['./caisse-depense.component.scss'],
  imports: [FormsModule, RouterModule, CommonModule, ReactiveFormsModule],
})
export class CaisseDepenseComponent {
  caisse: ICaisse | null = null;
  montant: number = 0;
  commentaire: string = '';
  modeOperationId: number = 1;
  numeroVC: string = '';
  banque: string = '';
  beneficiaire: string = '';
  crediteur: string = '';

  erreurMessage: string | null = null;

  EtatCaisse = EtatCaisse;

  constructor(
    private activatedRoute: ActivatedRoute,
    private operationService: OperationService,
    private caisseService: CaisseService,
    private router: Router,
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

    if (this.caisse.etat === EtatCaisse.CLOTURE) {
      this.erreurMessage = 'Impossible : la caisse est clôturée.';
      return;
    }
    const operation: IOperation = {
      id: 0,
      caisse: { id: this.caisse.id },
      montant: this.montant,
      commentaire: this.commentaire,
      modeOperation: { id: this.modeOperationId },
      banque: this.banque,
      beneficiaire: this.beneficiaire,
      crediteur: this.crediteur,
      numeroVC: this.numeroVC,
    };
    // this.operationService.effectuerDepense(operation).subscribe({
    //   next: res => {
    //     alert('Dépense effectuée avec succès ! ✅');
    //     console.log(res);
    //   },
    //   error: err => {
    //     alert("Erreur lors de l'enregistrement de la dépense ❌");
    //     console.error(err);
    //   },
    // });

    this.operationService.effectuerDepense(operation).subscribe({
      next: res => {
        this.erreurMessage = null; // reset
        alert('Dépense effectuée avec succès ! ✅');
        if (this.caisse?.id) {
          this.router.navigate(['/caisse', this.caisse.id, 'view']);
        }
        console.log(res);
      },
      error: err => {
        console.error(err);

        if (err.status === 400 || err.status === 403) {
          this.erreurMessage = err.error?.message || "Impossible d'effectuer la dépense : la caisse est fermée.";
        } else {
          this.erreurMessage = 'Une erreur inattendue est survenue.';
        }
      },
    });
  }
}
