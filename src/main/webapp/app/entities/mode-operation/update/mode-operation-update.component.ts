import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IModeOperation } from '../mode-operation.model';
import { ModeOperationService } from '../service/mode-operation.service';
import { ModeOperationFormService, ModeOperationFormGroup } from './mode-operation-form.service';

@Component({
  standalone: true,
  selector: 'jhi-mode-operation-update',
  templateUrl: './mode-operation-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ModeOperationUpdateComponent implements OnInit {
  isSaving = false;
  modeOperation: IModeOperation | null = null;

  editForm: ModeOperationFormGroup = this.modeOperationFormService.createModeOperationFormGroup();

  constructor(
    protected modeOperationService: ModeOperationService,
    protected modeOperationFormService: ModeOperationFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ modeOperation }) => {
      this.modeOperation = modeOperation;
      if (modeOperation) {
        this.updateForm(modeOperation);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const modeOperation = this.modeOperationFormService.getModeOperation(this.editForm);
    if (modeOperation.id !== null) {
      this.subscribeToSaveResponse(this.modeOperationService.update(modeOperation));
    } else {
      this.subscribeToSaveResponse(this.modeOperationService.create(modeOperation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IModeOperation>>): void {
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

  protected updateForm(modeOperation: IModeOperation): void {
    this.modeOperation = modeOperation;
    this.modeOperationFormService.resetForm(this.editForm, modeOperation);
  }
}
