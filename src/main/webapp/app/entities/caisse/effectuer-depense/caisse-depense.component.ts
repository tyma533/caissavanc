import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CaisseService } from '../service/caisse.service';
import { OperationService } from 'app/entities/operation/service/operation.service';
import { ICaisse } from '../caisse.model';
import { PieceJustificatifService } from 'app/entities/piece-justificatif/service/piece-justificatif.service';
import { CommonModule } from '@angular/common';
import { IOperation } from 'app/entities/operation/operation.model';
import { EtatCaisse } from 'app/entities/enumerations/etat-caisse.model';
import { Router } from '@angular/router';
import { DataUtils } from 'app/core/util/data-util.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NewPieceJustificatif } from 'app/entities/piece-justificatif/piece-justificatif.model';

@Component({
  standalone: true,
  selector: 'jhi-caisse-depense',
  templateUrl: './caisse-depense.component.html',
  styleUrls: ['./caisse-depense.component.scss'],
  imports: [FormsModule, RouterModule, CommonModule, ReactiveFormsModule, FontAwesomeModule],
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
  piece?: string;
  pieceContentType?: string;
  form: FormGroup;
  erreurMessage: string | null = null;

  EtatCaisse = EtatCaisse;

  constructor(
    private activatedRoute: ActivatedRoute,
    private operationService: OperationService,
    private caisseService: CaisseService,
    private pieceJustificatifService: PieceJustificatifService,
    private router: Router,
    private dataUtils: DataUtils, // ✅ ajout
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      piece: [],
      pieceContentType: [],
    });
  }

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

    this.operationService.effectuerDepense(operation).subscribe({
      next: res => {
        this.erreurMessage = null;
        alert('Dépense effectuée avec succès ! ✅');

        // Si une pièce justificative est attachée, on l'enregistre
        if (this.piece) {
          const pieceJustificative: NewPieceJustificatif = {
            id: null,
            libelle: 'Justificatif Dépense',
            piece: this.piece,
            pieceContentType: this.pieceContentType,
            operation: { id: res.id },
          };

          this.pieceJustificatifService.create(pieceJustificative).subscribe({
            next: () => {
              alert('Pièce justificative enregistrée ✅');
              this.router.navigate(['/caisse', this.caisse?.id, 'view']);
            },
            error: err => {
              console.error(err);
              this.erreurMessage = 'La dépense a été enregistrée, mais pas la pièce justificative.';
              this.router.navigate(['/caisse', this.caisse?.id, 'view']);
            },
          });
        } else {
          this.router.navigate(['/caisse', this.caisse?.id, 'view']);
        }
      },
      error: err => {
        console.error(err);
        this.erreurMessage = 'Erreur lors de l’enregistrement de la dépense.';
      },
    });
  }

  setFileData(event: Event): void {
    this.dataUtils.loadFileToForm(event, this.form, 'piece', false).subscribe({
      next: () => {
        this.piece = this.form.get('piece')?.value;
        this.pieceContentType = this.form.get('pieceContentType')?.value;
      },
      error: err => console.error('Erreur lors du chargement du fichier :', err),
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType?: string): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  removePiece(): void {
    this.piece = undefined;
    this.pieceContentType = undefined;
  }
  previousState(): void {
    window.history.back();
  }
}
