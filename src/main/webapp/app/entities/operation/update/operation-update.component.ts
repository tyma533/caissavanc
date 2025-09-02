import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ICaisse } from 'app/entities/caisse/caisse.model';
import { CaisseService } from 'app/entities/caisse/service/caisse.service';
import { ITypeOperation } from 'app/entities/type-operation/type-operation.model';
import { TypeOperationService } from 'app/entities/type-operation/service/type-operation.service';
import { IModeOperation } from 'app/entities/mode-operation/mode-operation.model';
import { ModeOperationService } from 'app/entities/mode-operation/service/mode-operation.service';
import { OperationService } from '../service/operation.service';
import { IOperation } from '../operation.model';
import { OperationFormService, OperationFormGroup } from './operation-form.service';

@Component({
  standalone: true,
  selector: 'jhi-operation-update',
  templateUrl: './operation-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class OperationUpdateComponent implements OnInit {
  isSaving = false;
  operation: IOperation | null = null;

  caissesSharedCollection: ICaisse[] = [];
  typeOperationsSharedCollection: ITypeOperation[] = [];
  modeOperationsSharedCollection: IModeOperation[] = [];

  editForm: OperationFormGroup = this.operationFormService.createOperationFormGroup();

  constructor(
    protected operationService: OperationService,
    protected operationFormService: OperationFormService,
    protected caisseService: CaisseService,
    protected typeOperationService: TypeOperationService,
    protected modeOperationService: ModeOperationService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareCaisse = (o1: ICaisse | null, o2: ICaisse | null): boolean => this.caisseService.compareCaisse(o1, o2);

  compareTypeOperation = (o1: ITypeOperation | null, o2: ITypeOperation | null): boolean =>
    this.typeOperationService.compareTypeOperation(o1, o2);

  compareModeOperation = (o1: IModeOperation | null, o2: IModeOperation | null): boolean =>
    this.modeOperationService.compareModeOperation(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ operation }) => {
      this.operation = operation;
      if (operation) {
        this.updateForm(operation);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const operation = this.operationFormService.getOperation(this.editForm);
    if (operation.id !== null) {
      this.subscribeToSaveResponse(this.operationService.update(operation));
    } else {
      this.subscribeToSaveResponse(this.operationService.create(operation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOperation>>): void {
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

  protected updateForm(operation: IOperation): void {
    this.operation = operation;
    this.operationFormService.resetForm(this.editForm, operation);

    this.caissesSharedCollection = this.caisseService.addCaisseToCollectionIfMissing<ICaisse>(
      this.caissesSharedCollection,
      operation.caisse,
    );
    this.typeOperationsSharedCollection = this.typeOperationService.addTypeOperationToCollectionIfMissing<ITypeOperation>(
      this.typeOperationsSharedCollection,
      operation.typeOperation,
    );
    this.modeOperationsSharedCollection = this.modeOperationService.addModeOperationToCollectionIfMissing<IModeOperation>(
      this.modeOperationsSharedCollection,
      operation.modeOperation,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.caisseService
      .query()
      .pipe(map((res: HttpResponse<ICaisse[]>) => res.body ?? []))
      .pipe(map((caisses: ICaisse[]) => this.caisseService.addCaisseToCollectionIfMissing<ICaisse>(caisses, this.operation?.caisse)))
      .subscribe((caisses: ICaisse[]) => (this.caissesSharedCollection = caisses));

    this.typeOperationService
      .query()
      .pipe(map((res: HttpResponse<ITypeOperation[]>) => res.body ?? []))
      .pipe(
        map((typeOperations: ITypeOperation[]) =>
          this.typeOperationService.addTypeOperationToCollectionIfMissing<ITypeOperation>(typeOperations, this.operation?.typeOperation),
        ),
      )
      .subscribe((typeOperations: ITypeOperation[]) => (this.typeOperationsSharedCollection = typeOperations));

    this.modeOperationService
      .query()
      .pipe(map((res: HttpResponse<IModeOperation[]>) => res.body ?? []))
      .pipe(
        map((modeOperations: IModeOperation[]) =>
          this.modeOperationService.addModeOperationToCollectionIfMissing<IModeOperation>(modeOperations, this.operation?.modeOperation),
        ),
      )
      .subscribe((modeOperations: IModeOperation[]) => (this.modeOperationsSharedCollection = modeOperations));
  }
}
