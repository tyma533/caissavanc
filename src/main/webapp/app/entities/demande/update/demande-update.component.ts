import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IEtablissement } from 'app/entities/etablissement/etablissement.model';
import { EtablissementService } from 'app/entities/etablissement/service/etablissement.service';
import { Type } from 'app/entities/enumerations/type.model';
import { DemandeService } from '../service/demande.service';
import { IDemande } from '../demande.model';
import { DemandeFormService, DemandeFormGroup } from './demande-form.service';
import { ICaisse } from 'app/entities/caisse/caisse.model';
import { CaisseService } from 'app/entities/caisse/service/caisse.service';
import { IModeOperation } from 'app/entities/mode-operation/mode-operation.model';
import { ModeOperationService } from 'app/entities/mode-operation/service/mode-operation.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'jhi-demande-update',
  templateUrl: './demande-update.component.html',
  styleUrls: ['./demande-update.component.scss'],
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class DemandeUpdateComponent implements OnInit {
  isSaving = false;
  demande: IDemande | null = null;
  typeValues = Object.keys(Type);

  etablissementsSharedCollection: IEtablissement[] = [];
  caissesSharedCollection: ICaisse[] = [];
  filteredCaisses: ICaisse[] = [];
  modeOperationsSharedCollection: IModeOperation[] = [];
  caissesOuvertes: ICaisse[] = [];
  caissesFermees: ICaisse[] = [];

  editForm: DemandeFormGroup = this.demandeFormService.createDemandeFormGroup();

  constructor(
    protected demandeService: DemandeService,
    protected demandeFormService: DemandeFormService,
    protected etablissementService: EtablissementService,
    protected caisseService: CaisseService,
    protected modeOperationService: ModeOperationService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
  ) {}

  compareEtablissement = (o1: IEtablissement | null, o2: IEtablissement | null): boolean =>
    this.etablissementService.compareEtablissement(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const origine = params['origine'];
      const typeParam = params['type'] as Type;
      const caisseId = params['caisseId'] ? +params['caisseId'] : null;
      const etablissementId = params['etablissementId'] ? +params['etablissementId'] : null;

      // Charger tous les établissements pour le select
      this.etablissementService.query().subscribe({
        next: (res: HttpResponse<IEtablissement[]>) => {
          this.etablissementsSharedCollection = res.body ?? [];

          // Si un etablissementId est fourni, charger l'objet complet
          if (etablissementId) {
            this.etablissementService.find(etablissementId).subscribe({
              next: (res: HttpResponse<IEtablissement>) => {
                if (res.body) {
                  // Préremplir le formulaire avec l'objet complet
                  this.editForm.get('etablissement')?.setValue(res.body, { emitEvent: false });

                  // Charger les caisses filtrées pour cet établissement
                  this.updateFilteredCaisses();

                  // Si un caisseId est fourni, le préremplir
                  if (caisseId) {
                    this.editForm.get('caisseId')?.setValue(caisseId);
                  }

                  // Définir le type si fourni
                  if (typeParam) {
                    this.editForm.get('type')?.setValue(typeParam);
                  }
                }
              },
              error: () => alert('Erreur lors du chargement de l’établissement'),
            });
          } else if (typeParam) {
            // Pas d'établissement mais type fourni
            this.editForm.get('type')?.setValue(typeParam);
          }
        },
        error: () => alert('Erreur lors du chargement des établissements'),
      });

      // Si on modifie une demande existante
      this.activatedRoute.data.subscribe(({ demande }) => {
        if (demande) {
          this.updateForm(demande);
        }
      });
    });

    // Réagir au changement de l'établissement pour filtrer les caisses
    this.editForm.get('etablissement')?.valueChanges.subscribe(etablissement => {
      const type = (this.editForm.get('type')?.value as Type | undefined) || '';
      if (!etablissement?.id) {
        this.clearCaisses();
        return;
      }

      if (type === Type.ALIMENTATION_CAISSE || type === Type.CLOTURE_CAISSE) {
        this.loadCaissesOuvertes(etablissement.id);
      } else if (type === Type.REOUVERTURE_CAISSE) {
        this.loadCaissesFermees(etablissement.id);
      } else {
        this.clearCaisses();
      }
    });

    // Charger tous les modes d’opération
    this.modeOperationService.query().subscribe({
      next: (res: HttpResponse<IModeOperation[]>) => {
        this.modeOperationsSharedCollection = res.body ?? [];
      },
      error: () => alert('Erreur lors du chargement des modes d’opération'),
    });

    // Réagir au changement de type pour filtrer les caisses
    this.editForm.get('type')?.valueChanges.subscribe(() => {
      this.updateFilteredCaisses();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const demande = this.demandeFormService.getDemande(this.editForm);

    // Validation pour l'alimentation
    if (demande.type === Type.ALIMENTATION_CAISSE) {
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

    if (demande.type === Type.CLOTURE_CAISSE && !demande.caisseId) {
      alert('Veuillez sélectionner une caisse à clôturer');
      this.isSaving = false;
      return;
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
    this.router.navigate(['/demande']);
  }

  protected onSaveError(): void {}

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(demande: IDemande): void {
    this.demande = demande;
    this.demandeFormService.resetForm(this.editForm, demande);

    this.etablissementsSharedCollection = this.etablissementService.addEtablissementToCollectionIfMissing(
      this.etablissementsSharedCollection,
      demande.etablissement,
    );

    if (demande.etablissement?.id) {
      const etabId = demande.etablissement.id;
      this.loadCaisses(etabId);
      this.updateFilteredCaisses();
    }

    if (demande.modeOperationId) {
      this.modeOperationsSharedCollection = this.modeOperationService.addModeOperationToCollectionIfMissing(
        this.modeOperationsSharedCollection,
        demande.modeOperationId,
      );
    }
  }

  protected updateFilteredCaisses(): void {
    const etab = this.editForm.get('etablissement')?.value;
    const type = this.editForm.get('type')?.value as Type | undefined;

    if (!etab?.id) {
      this.clearCaisses();
      return;
    }

    const etabId = etab.id;

    switch (type) {
      case Type.ALIMENTATION_CAISSE:
      case Type.CLOTURE_CAISSE:
        this.loadCaissesOuvertes(etabId); // alimentation et clôture → caisses ouvertes
        break;
      case Type.REOUVERTURE_CAISSE:
        this.loadCaissesFermees(etabId); // réouverture → caisses fermées
        break;
      default:
        this.clearCaisses();
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

  protected loadCaissesOuvertes(etablissementId: number): void {
    this.caisseService.getCaissesOuvertes(etablissementId).subscribe({
      next: (caisses: ICaisse[]) => {
        this.filteredCaisses = caisses;
        this.caissesOuvertes = caisses;
        if (!this.filteredCaisses.some(c => c.id === this.editForm.get('caisseId')?.value)) {
          this.editForm.get('caisseId')?.setValue(null);
        }
      },
      error: () => alert('Erreur lors du chargement des caisses ouvertes pour cet établissement'),
    });
  }

  protected loadCaissesFermees(etablissementId: number): void {
    this.caisseService.getCaissesFermees(etablissementId).subscribe({
      next: (caisses: ICaisse[]) => {
        console.log('Caisses fermées reçues:', caisses);
        this.caissesFermees = caisses;
        this.filteredCaisses = caisses; // ← indispensable pour que le <select> affiche
        if (!this.filteredCaisses.some(c => c.id === this.editForm.get('caisseId')?.value)) {
          this.editForm.get('caisseId')?.setValue(null);
        }
      },
      error: () => alert('Erreur lors du chargement des caisses fermées pour cet établissement'),
    });
  }

  protected clearCaisses(): void {
    this.filteredCaisses = [];
    this.caissesOuvertes = [];
    this.caissesFermees = [];
    this.editForm.get('caisseId')?.setValue(null);
  }
}
