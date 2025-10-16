import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ICaisse } from 'app/entities/caisse/caisse.model';
import { CaisseService } from 'app/entities/caisse/service/caisse.service';
import { IControle } from '../controle.model';
import { ControleService } from '../service/controle.service';
import { ControleFormService, ControleFormGroup } from './controle-form.service';

@Component({
  standalone: true,
  selector: 'jhi-controle-update',
  templateUrl: './controle-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ControleUpdateComponent implements OnInit {
  isSaving = false;
  controle: IControle | null = null;
  caisse: ICaisse | null = null;

  caissesSharedCollection: ICaisse[] = [];
  editForm: ControleFormGroup = this.controleFormService.createControleFormGroup();

  constructor(
    protected controleService: ControleService,
    protected controleFormService: ControleFormService,
    protected caisseService: CaisseService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareCaisse = (o1: ICaisse | null, o2: ICaisse | null): boolean => this.caisseService.compareCaisse(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const caisseId = params['caisseId'];
      if (caisseId) {
        this.caisseService.find(caisseId).subscribe({
          next: (res: HttpResponse<ICaisse>) => {
            this.caisse = res.body ?? null;
            if (this.caisse) {
              // 🔹 Préremplir le champ "caisse" du formulaire
              this.editForm.patchValue({ caisse: this.caisse });
            }
          },
        });
      }
    });

    this.activatedRoute.data.subscribe(({ controle }) => {
      this.controle = controle;
      if (controle) {
        this.updateForm(controle);
      }
      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const controle = this.controleFormService.getControle(this.editForm);
    if (controle.id !== null) {
      this.subscribeToSaveResponse(this.controleService.update(controle));
    } else {
      this.subscribeToSaveResponse(this.controleService.create(controle));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IControle>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Custom error handling
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(controle: IControle): void {
    this.controle = controle;
    this.controleFormService.resetForm(this.editForm, controle);
    this.caissesSharedCollection = this.caisseService.addCaisseToCollectionIfMissing<ICaisse>(
      this.caissesSharedCollection,
      controle.caisse,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.caisseService
      .query()
      .pipe(map((res: HttpResponse<ICaisse[]>) => res.body ?? []))
      .pipe(map((caisses: ICaisse[]) => this.caisseService.addCaisseToCollectionIfMissing<ICaisse>(caisses, this.controle?.caisse)))
      .subscribe((caisses: ICaisse[]) => (this.caissesSharedCollection = caisses));
  }
}
