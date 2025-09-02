import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ICaisse } from 'app/entities/caisse/caisse.model';
import { CaisseService } from 'app/entities/caisse/service/caisse.service';
import { IRubrique } from 'app/entities/rubrique/rubrique.model';
import { RubriqueService } from 'app/entities/rubrique/service/rubrique.service';
import { CaisseRubriqueService } from '../service/caisse-rubrique.service';
import { ICaisseRubrique } from '../caisse-rubrique.model';
import { CaisseRubriqueFormService, CaisseRubriqueFormGroup } from './caisse-rubrique-form.service';

@Component({
  standalone: true,
  selector: 'jhi-caisse-rubrique-update',
  templateUrl: './caisse-rubrique-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class CaisseRubriqueUpdateComponent implements OnInit {
  isSaving = false;
  caisseRubrique: ICaisseRubrique | null = null;

  caissesSharedCollection: ICaisse[] = [];
  rubriquesSharedCollection: IRubrique[] = [];

  editForm: CaisseRubriqueFormGroup = this.caisseRubriqueFormService.createCaisseRubriqueFormGroup();

  constructor(
    protected caisseRubriqueService: CaisseRubriqueService,
    protected caisseRubriqueFormService: CaisseRubriqueFormService,
    protected caisseService: CaisseService,
    protected rubriqueService: RubriqueService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareCaisse = (o1: ICaisse | null, o2: ICaisse | null): boolean => this.caisseService.compareCaisse(o1, o2);

  compareRubrique = (o1: IRubrique | null, o2: IRubrique | null): boolean => this.rubriqueService.compareRubrique(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ caisseRubrique }) => {
      this.caisseRubrique = caisseRubrique;
      if (caisseRubrique) {
        this.updateForm(caisseRubrique);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const caisseRubrique = this.caisseRubriqueFormService.getCaisseRubrique(this.editForm);
    if (caisseRubrique.id !== null) {
      this.subscribeToSaveResponse(this.caisseRubriqueService.update(caisseRubrique));
    } else {
      this.subscribeToSaveResponse(this.caisseRubriqueService.create(caisseRubrique));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICaisseRubrique>>): void {
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

  protected updateForm(caisseRubrique: ICaisseRubrique): void {
    this.caisseRubrique = caisseRubrique;
    this.caisseRubriqueFormService.resetForm(this.editForm, caisseRubrique);

    this.caissesSharedCollection = this.caisseService.addCaisseToCollectionIfMissing<ICaisse>(
      this.caissesSharedCollection,
      caisseRubrique.caisse,
    );
    this.rubriquesSharedCollection = this.rubriqueService.addRubriqueToCollectionIfMissing<IRubrique>(
      this.rubriquesSharedCollection,
      caisseRubrique.rubrique,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.caisseService
      .query()
      .pipe(map((res: HttpResponse<ICaisse[]>) => res.body ?? []))
      .pipe(map((caisses: ICaisse[]) => this.caisseService.addCaisseToCollectionIfMissing<ICaisse>(caisses, this.caisseRubrique?.caisse)))
      .subscribe((caisses: ICaisse[]) => (this.caissesSharedCollection = caisses));

    this.rubriqueService
      .query()
      .pipe(map((res: HttpResponse<IRubrique[]>) => res.body ?? []))
      .pipe(
        map((rubriques: IRubrique[]) =>
          this.rubriqueService.addRubriqueToCollectionIfMissing<IRubrique>(rubriques, this.caisseRubrique?.rubrique),
        ),
      )
      .subscribe((rubriques: IRubrique[]) => (this.rubriquesSharedCollection = rubriques));
  }
}
