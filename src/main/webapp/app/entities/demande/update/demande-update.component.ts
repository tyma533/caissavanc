import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

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
  filteredCaisses: ICaisse[] = []; // caisses disponibles pour l'établissement choisi

  editForm: DemandeFormGroup = this.demandeFormService.createDemandeFormGroup();

  constructor(
    protected demandeService: DemandeService,
    protected demandeFormService: DemandeFormService,
    protected etablissementService: EtablissementService,
    protected caisseService: CaisseService,
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

    // Charger tous les établissements depuis l'API
    this.etablissementService.query().subscribe((res: HttpResponse<IEtablissement[]>) => {
      this.etablissementsSharedCollection = res.body ?? [];
    });

    // Réagir au changement de l'établissement pour filtrer les caisses
    this.editForm.get('etablissement')?.valueChanges.subscribe(etablissement => {
      if (etablissement?.id) {
        this.filteredCaisses = this.caissesSharedCollection.filter(c => c.etablissement?.id === etablissement.id);
      } else {
        this.filteredCaisses = [];
      }

      // Réinitialiser la caisse sélectionnée si elle ne fait plus partie de la liste filtrée
      if (!this.filteredCaisses.some(c => c.id === this.editForm.get('caisseId')?.value)) {
        this.editForm.get('caisseId')?.setValue(null);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const demande = this.demandeFormService.getDemande(this.editForm);
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

  protected onSaveError(): void {
    // Api pour héritage
  }

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
  }

  protected loadRelationshipsOptions(): void {
    this.etablissementService
      .query()
      .pipe(map((res: HttpResponse<IEtablissement[]>) => res.body ?? []))
      .pipe(
        map((etablissements: IEtablissement[]) =>
          this.etablissementService.addEtablissementToCollectionIfMissing<IEtablissement>(etablissements, this.demande?.etablissement),
        ),
      )
      .subscribe((etablissements: IEtablissement[]) => (this.etablissementsSharedCollection = etablissements));
  }

  protected loadCaisses(): void {
    this.caisseService
      .query()
      .pipe(map((res: HttpResponse<ICaisse[]>) => res.body ?? []))
      .subscribe((caisses: ICaisse[]) => {
        this.caissesSharedCollection = caisses;
      });
  }
}
