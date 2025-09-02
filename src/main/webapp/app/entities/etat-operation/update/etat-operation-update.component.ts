import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IEtatOperation } from '../etat-operation.model';
import { EtatOperationService } from '../service/etat-operation.service';
import { EtatOperationFormService, EtatOperationFormGroup } from './etat-operation-form.service';

@Component({
  standalone: true,
  selector: 'jhi-etat-operation-update',
  templateUrl: './etat-operation-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class EtatOperationUpdateComponent implements OnInit {
  isSaving = false;
  etatOperation: IEtatOperation | null = null;

  editForm: EtatOperationFormGroup = this.etatOperationFormService.createEtatOperationFormGroup();

  constructor(
    protected etatOperationService: EtatOperationService,
    protected etatOperationFormService: EtatOperationFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ etatOperation }) => {
      this.etatOperation = etatOperation;
      if (etatOperation) {
        this.updateForm(etatOperation);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const etatOperation = this.etatOperationFormService.getEtatOperation(this.editForm);
    if (etatOperation.id !== null) {
      this.subscribeToSaveResponse(this.etatOperationService.update(etatOperation));
    } else {
      this.subscribeToSaveResponse(this.etatOperationService.create(etatOperation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEtatOperation>>): void {
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

  protected updateForm(etatOperation: IEtatOperation): void {
    this.etatOperation = etatOperation;
    this.etatOperationFormService.resetForm(this.editForm, etatOperation);
  }
}
