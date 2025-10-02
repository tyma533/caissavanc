import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IOperation } from 'app/entities/operation/operation.model';
import { OperationService } from 'app/entities/operation/service/operation.service';
import { PieceJustificatifService } from '../service/piece-justificatif.service';
import { IPieceJustificatif } from '../piece-justificatif.model';
import { PieceJustificatifFormService, PieceJustificatifFormGroup } from './piece-justificatif-form.service';

@Component({
  standalone: true,
  selector: 'jhi-piece-justificatif-update',
  templateUrl: './piece-justificatif-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class PieceJustificatifUpdateComponent implements OnInit {
  isSaving = false;
  pieceJustificatif: IPieceJustificatif | null = null;

  operationsSharedCollection: IOperation[] = [];

  editForm: PieceJustificatifFormGroup = this.pieceJustificatifFormService.createPieceJustificatifFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected pieceJustificatifService: PieceJustificatifService,
    protected pieceJustificatifFormService: PieceJustificatifFormService,
    protected operationService: OperationService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareOperation = (o1: IOperation | null, o2: IOperation | null): boolean => this.operationService.compareOperation(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pieceJustificatif }) => {
      this.pieceJustificatif = pieceJustificatif;
      if (pieceJustificatif) {
        this.updateForm(pieceJustificatif);
      } else {
        // 👇 Si on crée un nouveau justificatif
        this.activatedRoute.queryParams.subscribe(params => {
          const operationId = params['operationId'];
          if (operationId) {
            this.operationService.find(operationId).subscribe(opRes => {
              const operation = opRes.body;
              if (operation) {
                // Pré-remplir le formulaire avec l'opération
                this.editForm.patchValue({ operation });
                this.operationsSharedCollection = [operation];
              }
            });
          }
        });
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('caissavance2App.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const pieceJustificatif = this.pieceJustificatifFormService.getPieceJustificatif(this.editForm);
    if (pieceJustificatif.id !== null) {
      this.subscribeToSaveResponse(this.pieceJustificatifService.update(pieceJustificatif));
    } else {
      this.subscribeToSaveResponse(this.pieceJustificatifService.create(pieceJustificatif));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPieceJustificatif>>): void {
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

  protected updateForm(pieceJustificatif: IPieceJustificatif): void {
    this.pieceJustificatif = pieceJustificatif;
    this.pieceJustificatifFormService.resetForm(this.editForm, pieceJustificatif);

    this.operationsSharedCollection = this.operationService.addOperationToCollectionIfMissing<IOperation>(
      this.operationsSharedCollection,
      pieceJustificatif.operation,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.operationService
      .query()
      .pipe(map((res: HttpResponse<IOperation[]>) => res.body ?? []))
      .pipe(
        map((operations: IOperation[]) =>
          this.operationService.addOperationToCollectionIfMissing<IOperation>(operations, this.pieceJustificatif?.operation),
        ),
      )
      .subscribe((operations: IOperation[]) => (this.operationsSharedCollection = operations));
  }
}
