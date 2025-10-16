import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CaisseService } from '../../service/caisse.service';
import { OperationService } from 'app/entities/operation/service/operation.service';
import { ICaisse } from '../../caisse.model';
import { PieceJustificatifService } from 'app/entities/piece-justificatif/service/piece-justificatif.service';
import { CommonModule } from '@angular/common';
import { IOperation } from 'app/entities/operation/operation.model';
import { EtatCaisse } from 'app/entities/enumerations/etat-caisse.model';
import { Router } from '@angular/router';
import { DataUtils } from 'app/core/util/data-util.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NewPieceJustificatif } from 'app/entities/piece-justificatif/piece-justificatif.model';
import Swal from 'sweetalert2';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'jhi-effectuer-depense',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FontAwesomeModule,
    MatButtonModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './effectuer-depense.component.html',
  styleUrls: ['./effectuer-depense.component.scss'],
})
export class EffectuerDepenseComponent {
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
  operations: IOperation[] = [];
  showModalPiece = false;
  libellePiece: string = '';
  file: any = null;
  fileName: string | null = null;
  pieces: any[] = []; // tableau des pièces ajoutées
  EtatCaisse = EtatCaisse;

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isEditable = false;
  isLinear = false;
  dernierOperation?: IOperation; // nouvelle variable

  constructor(
    private activatedRoute: ActivatedRoute,
    private operationService: OperationService,
    private caisseService: CaisseService,
    private pieceJustificatifService: PieceJustificatifService,
    private router: Router,
    private dataUtils: DataUtils, // ✅ ajout
    private fb: FormBuilder,
    private _formBuilder: FormBuilder,
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
      // alert('Aucune caisse sélectionnée');
      Swal.fire('Erreur', 'Aucune caisse sélectionnée', 'error');
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
        this.dernierOperation = res; // stocke l'opération créée

        this.erreurMessage = null;
        // alert('Dépense effectuée avec succès ! ✅');
        Swal.fire('Succès', 'Dépense effectuée avec succès !', 'success');

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
              // alert('Pièce justificative enregistrée ✅');
              Swal.fire('Succès', 'Pièce justificative enregistrée avec succès !', 'success');
              this.router.navigate(['/caisse', this.caisse?.id, 'view']);
            },
            error: err => {
              console.error(err);
              this.erreurMessage = 'La dépense a été enregistrée, mais pas la pièce justificative.';
            },
          });
        } else {
          this.router.navigate(['/caisse', this.caisse?.id, 'depense', 'view']);
        }
      },
      error: err => {
        console.error(err);
        this.erreurMessage = 'Erreur lors de l’enregistrement de la dépense.';
      },
    });
    // 🔹 Redirection vers la liste des demandes
    this.router.navigate(['/caisse', this.caisse.id, 'depense']);
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

  // Ouvrir le modal
  ouvrirModalPiece() {
    this.libellePiece = '';
    this.file = null;
    this.fileName = null;
    this.showModalPiece = true;
  }

  // Fermer le modal
  fermerModalPiece() {
    this.showModalPiece = false;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType?: string): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }

  goToPieces(stepper: any) {
    if (this.depenseFormValid()) {
      stepper.next();
    } else {
      alert('Veuillez remplir tous les champs obligatoires.');
    }
  }

  depenseFormValid(): boolean {
    return !!(this.montant && this.commentaire && this.modeOperationId);
  }

  ajouterPiece() {
    if (!this.libellePiece || !this.file) {
      Swal.fire('Erreur', 'Veuillez saisir le libellé et choisir un fichier.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64File = (reader.result as string).split(',')[1];

      this.pieces.push({
        libelle: this.libellePiece,
        piece: base64File,
        pieceContentType: this.file.type,
      });

      this.fermerModalPiece();
      this.libellePiece = '';
      this.file = null;
      this.fileName = '';
    };

    reader.readAsDataURL(this.file);
  }

  removePiece(piece: any) {
    this.pieces = this.pieces.filter(p => p !== piece);
  }

  // Sélectionner le fichier
  onFileSelected(event: any) {
    const f = event.target.files[0];
    if (f) {
      this.file = f;
      this.fileName = f.name;
    }
  }
}
