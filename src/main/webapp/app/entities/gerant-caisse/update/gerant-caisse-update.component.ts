import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ICaisse } from 'app/entities/caisse/caisse.model';
import { CaisseService } from 'app/entities/caisse/service/caisse.service';
import { IGerant } from 'app/entities/gerant/gerant.model';
import { GerantService } from 'app/entities/gerant/service/gerant.service';
import { GerantCaisseService } from '../service/gerant-caisse.service';
import { IGerantCaisse } from '../gerant-caisse.model';
import { GerantCaisseFormService, GerantCaisseFormGroup } from './gerant-caisse-form.service';

@Component({
  standalone: true,
  selector: 'jhi-gerant-caisse-update',
  templateUrl: './gerant-caisse-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class GerantCaisseUpdateComponent implements OnInit {
  isSaving = false;
  gerantCaisse: IGerantCaisse | null = null;

  caissesSharedCollection: ICaisse[] = [];
  gerantsSharedCollection: IGerant[] = [];

  editForm: GerantCaisseFormGroup = this.gerantCaisseFormService.createGerantCaisseFormGroup();

  constructor(
    protected gerantCaisseService: GerantCaisseService,
    protected gerantCaisseFormService: GerantCaisseFormService,
    protected caisseService: CaisseService,
    protected gerantService: GerantService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareCaisse = (o1: ICaisse | null, o2: ICaisse | null): boolean => this.caisseService.compareCaisse(o1, o2);

  compareGerant = (o1: IGerant | null, o2: IGerant | null): boolean => this.gerantService.compareGerant(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ gerantCaisse }) => {
      this.gerantCaisse = gerantCaisse;
      if (gerantCaisse) {
        this.updateForm(gerantCaisse);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const gerantCaisse = this.gerantCaisseFormService.getGerantCaisse(this.editForm);
    if (gerantCaisse.id !== null) {
      this.subscribeToSaveResponse(this.gerantCaisseService.update(gerantCaisse));
    } else {
      this.subscribeToSaveResponse(this.gerantCaisseService.create(gerantCaisse));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGerantCaisse>>): void {
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

  protected updateForm(gerantCaisse: IGerantCaisse): void {
    this.gerantCaisse = gerantCaisse;
    this.gerantCaisseFormService.resetForm(this.editForm, gerantCaisse);

    this.caissesSharedCollection = this.caisseService.addCaisseToCollectionIfMissing<ICaisse>(
      this.caissesSharedCollection,
      gerantCaisse.caisse,
    );
    this.gerantsSharedCollection = this.gerantService.addGerantToCollectionIfMissing<IGerant>(
      this.gerantsSharedCollection,
      gerantCaisse.gerant,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.caisseService
      .query()
      .pipe(map((res: HttpResponse<ICaisse[]>) => res.body ?? []))
      .pipe(map((caisses: ICaisse[]) => this.caisseService.addCaisseToCollectionIfMissing<ICaisse>(caisses, this.gerantCaisse?.caisse)))
      .subscribe((caisses: ICaisse[]) => (this.caissesSharedCollection = caisses));

    this.gerantService
      .query()
      .pipe(map((res: HttpResponse<IGerant[]>) => res.body ?? []))
      .pipe(map((gerants: IGerant[]) => this.gerantService.addGerantToCollectionIfMissing<IGerant>(gerants, this.gerantCaisse?.gerant)))
      .subscribe((gerants: IGerant[]) => (this.gerantsSharedCollection = gerants));
  }
}
