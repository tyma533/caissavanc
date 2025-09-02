import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ITypeOperation } from '../type-operation.model';
import { TypeOperationService } from '../service/type-operation.service';
import { TypeOperationFormService, TypeOperationFormGroup } from './type-operation-form.service';

@Component({
  standalone: true,
  selector: 'jhi-type-operation-update',
  templateUrl: './type-operation-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TypeOperationUpdateComponent implements OnInit {
  isSaving = false;
  typeOperation: ITypeOperation | null = null;

  editForm: TypeOperationFormGroup = this.typeOperationFormService.createTypeOperationFormGroup();

  constructor(
    protected typeOperationService: TypeOperationService,
    protected typeOperationFormService: TypeOperationFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ typeOperation }) => {
      this.typeOperation = typeOperation;
      if (typeOperation) {
        this.updateForm(typeOperation);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const typeOperation = this.typeOperationFormService.getTypeOperation(this.editForm);
    if (typeOperation.id !== null) {
      this.subscribeToSaveResponse(this.typeOperationService.update(typeOperation));
    } else {
      this.subscribeToSaveResponse(this.typeOperationService.create(typeOperation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITypeOperation>>): void {
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

  protected updateForm(typeOperation: ITypeOperation): void {
    this.typeOperation = typeOperation;
    this.typeOperationFormService.resetForm(this.editForm, typeOperation);
  }
}
