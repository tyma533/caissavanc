import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IEtablissement } from 'app/entities/etablissement/etablissement.model';
import { EtablissementService } from 'app/entities/etablissement/service/etablissement.service';
import { EtatCaisse } from 'app/entities/enumerations/etat-caisse.model';
import { CaisseService } from '../service/caisse.service';
import { ICaisse } from '../caisse.model';
import { CaisseFormService, CaisseFormGroup } from './caisse-form.service';

@Component({
  standalone: true,
  selector: 'jhi-caisse-update',
  templateUrl: './caisse-update.component.html',
  styleUrls: ['./caisse-update.component.scss'],
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class CaisseUpdateComponent implements OnInit {
  isSaving = false;
  caisse: ICaisse | null = null;
  etatCaisseValues = Object.keys(EtatCaisse);

  etablissementsSharedCollection: IEtablissement[] = [];

  editForm: CaisseFormGroup = this.caisseFormService.createCaisseFormGroup();

  constructor(
    protected caisseService: CaisseService,
    protected caisseFormService: CaisseFormService,
    protected etablissementService: EtablissementService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareEtablissement = (o1: IEtablissement | null, o2: IEtablissement | null): boolean =>
    this.etablissementService.compareEtablissement(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ caisse }) => {
      this.caisse = caisse;
      if (caisse) {
        this.updateForm(caisse);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const caisse = this.caisseFormService.getCaisse(this.editForm);
    if (caisse.id !== null) {
      this.subscribeToSaveResponse(this.caisseService.update(caisse));
    } else {
      this.subscribeToSaveResponse(this.caisseService.create(caisse));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICaisse>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(caisse: ICaisse): void {
    this.caisse = caisse;
    this.caisseFormService.resetForm(this.editForm, caisse);

    this.etablissementsSharedCollection = this.etablissementService.addEtablissementToCollectionIfMissing<IEtablissement>(
      this.etablissementsSharedCollection,
      caisse.etablissement,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.etablissementService
      .query()
      .pipe(map((res: HttpResponse<IEtablissement[]>) => res.body ?? []))
      .pipe(
        map((etablissements: IEtablissement[]) =>
          this.etablissementService.addEtablissementToCollectionIfMissing<IEtablissement>(etablissements, this.caisse?.etablissement),
        ),
      )
      .subscribe((etablissements: IEtablissement[]) => (this.etablissementsSharedCollection = etablissements));
  }
}
