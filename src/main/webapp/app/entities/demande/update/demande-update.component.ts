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
import { TYPEALIMENTATIONCAISSEEXECUTION, TYPEALIMENTATIONCAISSEVALIDATION } from 'app/app.constants';
import Swal from 'sweetalert2';

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
  isFromCaisse = false;
  typeAlimentationCaisse?: string;
  TYPEALIMENTATIONCAISSEVALIDATION = TYPEALIMENTATIONCAISSEVALIDATION;
  TYPEALIMENTATIONCAISSEEXECUTION = TYPEALIMENTATIONCAISSEEXECUTION;

  TYPEALIMENTATIONCAISSE = Type.ALIMENTATION_CAISSE;
  TYPECLOTURECAISSE = Type.CLOTURE_CAISSE;
  TYPEREOUVERTURECAISSE = Type.REOUVERTURE_CAISSE;
  fromCaisse = false;

  // id préremplis (utiles si disabled)
  prefilledCaisseId: number | null = null;
  prefilledEtablissementId: number | null = null;

  caisseInfo?: ICaisse | null;
  etablissementInfo?: IEtablissement | null;
  titreDemande: string = '';

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
    console.log('DemandeUpdateComponent initialized');
    this.activatedRoute.queryParams.subscribe(params => {
      // const origine = params['origine'];
      const typeParam = params['type'] ? (params['type'] as keyof typeof Type) : null;
      const caisseId = params['caisseId'] ? +params['caisseId'] : null;
      const etablissementId = params['etablissementId'] ? +params['etablissementId'] : null;

      const origine = params['origine'];
      if (origine === 'caisse') {
        this.fromCaisse = true;
      }

      if (typeParam && caisseId && etablissementId) {
        // Charger les infos de la caisse
        this.caisseService.find(caisseId).subscribe({
          next: (res: HttpResponse<ICaisse>) => {
            this.caisseInfo = res.body;
            this.updateTitre(); // Met à jour le titre
          },
        });

        this.editForm.get('type')?.valueChanges.subscribe(() => {
          this.updateTitre();
        });

        // Charger les infos de l'établissement
        this.etablissementService.find(etablissementId).subscribe({
          next: (res: HttpResponse<IEtablissement>) => {
            this.etablissementInfo = res.body;
            this.updateTitre();
          },
        });
      }

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

                  if (origine === 'caisse') {
                    this.isFromCaisse = true;
                    this.disablePrefilledFields();
                  }
                }
              },
              error: err =>
                // alert('Erreur lors du chargement de l’établissement'),
                Swal.fire('Erreur', err.error.detail, 'error'),
            });
          } else if (typeParam) {
            this.editForm.get('type')?.setValue(Type[typeParam]);
          }
        },
        error: err =>
          //  alert('Erreur lors du chargement des établissements'),
          Swal.fire('Erreur', err.error.detail, 'error'),
      });
      console.log(this.demande);
      // Si on modifie une demande existante
      this.activatedRoute.data.subscribe(({ demande }) => {
        if (demande) {
          console.log(demande);

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
      error: err =>
        // alert('Erreur lors du chargement des modes d’opération'),
        Swal.fire('Erreur', err.error.detail, 'error'),
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
        // alert('Veuillez sélectionner une caisse');
        Swal.fire('Erreur', 'Veuillez sélectionner une caisse', 'error');
        this.isSaving = false;
        return;
      }
      if (!demande.montant || demande.montant <= 0) {
        // alert('Veuillez saisir un montant valide');
        Swal.fire('Erreur', 'Veuillez saisir un montant valide', 'error');
        this.isSaving = false;
        return;
      }
    }

    if (demande.type === Type.CLOTURE_CAISSE && !demande.caisseId) {
      // alert('Veuillez sélectionner une caisse à clôturer');
      Swal.fire('Erreur', 'Veuillez sélectionner une caisse à clôturer', 'error');
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
    console.log(demande);
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

    // si on a un demande (édition) : on ne masque rien par défaut
    this.isFromCaisse = false;
    this.enablePrefilledFields();
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
      error: err =>
        //  alert('Erreur lors du chargement des caisses pour cet établissement'),
        Swal.fire('Erreur', err.error.detail, 'error'),
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
      // error: () => alert('Erreur lors du chargement des caisses ouvertes pour cet établissement'),
      error: err =>
        //  alert('Erreur lors du chargement des caisses ouvertes pour cet établissement'),
        Swal.fire('Erreur', err.error.detail, 'error'),
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
      error: err =>
        // alert('Erreur lors du chargement des caisses fermées pour cet établissement'),
        Swal.fire('Erreur', err.error.detail, 'error'),
    });
  }

  protected clearCaisses(): void {
    this.filteredCaisses = [];
    this.caissesOuvertes = [];
    this.caissesFermees = [];
    this.editForm.get('caisseId')?.setValue(null);
  }
  protected compareEtab(a: any, b: any) {
    return a && b && a.id === b.id;
  }

  // Désactive les champs préremplis (appeler quand isFromCaisse)
  protected disablePrefilledFields(): void {
    // note: disable ne supprime pas la valeur, elle devient simplement non modifiable
    try {
      this.editForm.get('type')?.disable({ emitEvent: false });
      this.editForm.get('etablissement')?.disable({ emitEvent: false });
      this.editForm.get('caisseId')?.disable({ emitEvent: false });
    } catch (e) {
      // ignore si control manquant
    }
  }

  // Si nécessaire pour réactiver
  protected enablePrefilledFields(): void {
    try {
      this.editForm.get('type')?.enable({ emitEvent: false });
      this.editForm.get('etablissement')?.enable({ emitEvent: false });
      this.editForm.get('caisseId')?.enable({ emitEvent: false });
    } catch (e) {
      // ignore
    }
  }

  updateTitre(): void {
    if (!this.caisseInfo || !this.etablissementInfo) return;

    const type = this.editForm.get('type')?.value;
    let typeLabel = '';

    switch (type) {
      case 'ALIMENTATION_CAISSE':
        typeLabel = 'd’alimentation';
        break;
      case 'CLOTURE_CAISSE':
        typeLabel = 'de clôture';
        break;
      case 'REOUVERTURE_CAISSE':
        typeLabel = 'de réouverture';
        break;
    }

    this.titreDemande = `Demande ${typeLabel} : ${this.caisseInfo.libelle} [${
      this.etablissementInfo.sigle || this.etablissementInfo.libelle
    }]`;
  }
}
