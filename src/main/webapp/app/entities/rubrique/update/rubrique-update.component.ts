import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IRubrique } from '../rubrique.model';
import { RubriqueService } from '../service/rubrique.service';
import { RubriqueFormService, RubriqueFormGroup } from './rubrique-form.service';

@Component({
  standalone: true,
  selector: 'jhi-rubrique-update',
  templateUrl: './rubrique-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class RubriqueUpdateComponent implements OnInit {
  isSaving = false;
  rubrique: IRubrique | null = null;

  editForm: RubriqueFormGroup = this.rubriqueFormService.createRubriqueFormGroup();

  constructor(
    protected rubriqueService: RubriqueService,
    protected rubriqueFormService: RubriqueFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ rubrique }) => {
      this.rubrique = rubrique;
      if (rubrique) {
        this.updateForm(rubrique);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const rubrique = this.rubriqueFormService.getRubrique(this.editForm);
    if (rubrique.id !== null) {
      this.subscribeToSaveResponse(this.rubriqueService.update(rubrique));
    } else {
      this.subscribeToSaveResponse(this.rubriqueService.create(rubrique));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRubrique>>): void {
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

  protected updateForm(rubrique: IRubrique): void {
    this.rubrique = rubrique;
    this.rubriqueFormService.resetForm(this.editForm, rubrique);
  }
}
