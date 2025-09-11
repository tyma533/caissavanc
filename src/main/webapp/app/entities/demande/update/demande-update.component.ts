import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IEtablissement } from 'app/entities/etablissement/etablissement.model';
import { EtablissementService } from 'app/entities/etablissement/service/etablissement.service';
import { Objet } from 'app/entities/enumerations/objet.model';
import { DemandeService } from '../service/demande.service';
import { IDemande } from '../demande.model';
import { DemandeFormService, DemandeFormGroup } from './demande-form.service';
import { ICaisse } from 'app/entities/caisse/caisse.model';
import { CaisseService } from 'app/entities/caisse/service/caisse.service';
import { IModeOperation } from 'app/entities/mode-operation/mode-operation.model';
import { ModeOperationService } from 'app/entities/mode-operation/service/mode-operation.service';

@Component({
  standalone: true,
  selector: 'jhi-demande-update',
  templateUrl: './demande-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class DemandeUpdateComponent implements OnInit {
  isSaving = false;
  demande: IDemande | null = null;
  objetValues = Object.keys(Objet);

  etablissementsSharedCollection: IEtablissement[] = [];
  caissesSharedCollection: ICaisse[] = [];
  filteredCaisses: ICaisse[] = [];
  modeOperationsSharedCollection: IModeOperation[] = [];

  editForm: DemandeFormGroup = this.demandeFormService.createDemandeFormGroup();

  constructor(
    protected demandeService: DemandeService,
    protected demandeFormService: DemandeFormService,
    protected etablissementService: EtablissementService,
    protected caisseService: CaisseService,
    protected modeOperationService: ModeOperationService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareEtablissement = (o1: IEtablissement | null, o2: IEtablissement | null): boolean =>
    this.etablissementService.compareEtablissement(o1, o2);

  ngOnInit(): void {
    // Charger la demande si modification
    this.activatedRoute.data.subscribe(({ demande }) => {
      this.demande = demande;
      if (demande) {
        this.updateForm(demande);
      }
    });

    // Charger tous les établissements
    this.etablissementService.query().subscribe({
      next: (res: HttpResponse<IEtablissement[]>) => {
        this.etablissementsSharedCollection = res.body ?? [];
      },
      error: () => alert('Erreur lors du chargement des établissements'),
    });

    // Réagir au changement de l'établissement pour filtrer les caisses
    this.editForm.get('etablissement')?.valueChanges.subscribe(etablissement => {
      if (etablissement?.id) {
        this.loadCaisses(etablissement.id);
      } else {
        this.filteredCaisses = [];
        this.editForm.get('caisseId')?.setValue(null);
      }
    });

    // Charger tous les modes d’opération
    this.modeOperationService.query().subscribe({
      next: (res: HttpResponse<IModeOperation[]>) => {
        this.modeOperationsSharedCollection = res.body ?? [];
      },
      error: () => alert('Erreur lors du chargement des modes d’opération'),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const demande = this.demandeFormService.getDemande(this.editForm);

    // Validation pour l'alimentation
    if (demande.objet === Objet.ALIMENTATION_CAISSE) {
      if (!demande.caisseId) {
        alert('Veuillez sélectionner une caisse');
        this.isSaving = false;
        return;
      }
      if (!demande.montant || demande.montant <= 0) {
        alert('Veuillez saisir un montant valide');
        this.isSaving = false;
        return;
      }
    }

    if (demande.id !== null) {
      this.subscribeToSaveResponse(this.demandeService.update(demande));
    } else {
      this.subscribeToSaveResponse(this.demandeService.create(demande));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDemande>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {}

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(demande: IDemande): void {
    this.demande = demande;
    this.demandeFormService.resetForm(this.editForm, demande);

    this.etablissementsSharedCollection = this.etablissementService.addEtablissementToCollectionIfMissing<IEtablissement>(
      this.etablissementsSharedCollection,
      demande.etablissement,
    );

    if (demande.etablissement?.id) {
      this.loadCaisses(demande.etablissement.id);
    }
    // S'assurer que le mode existe dans la liste
    if (demande.modeOperationId) {
      this.modeOperationsSharedCollection = this.modeOperationService.addModeOperationToCollectionIfMissing(
        this.modeOperationsSharedCollection,
        demande.modeOperationId,
      );
    }
  }

  protected loadCaisses(etablissementId: number): void {
    this.caisseService.findByEtablissementId(etablissementId).subscribe({
      next: (caisses: ICaisse[]) => {
        this.caissesSharedCollection = caisses;
        this.filteredCaisses = [...caisses];

        if (!this.filteredCaisses.some(c => c.id === this.editForm.get('caisseId')?.value)) {
          this.editForm.get('caisseId')?.setValue(null);
        }
      },
      error: () => alert('Erreur lors du chargement des caisses pour cet établissement'),
    });
  }
}
