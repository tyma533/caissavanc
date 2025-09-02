import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IPieceJustificatif, NewPieceJustificatif } from '../piece-justificatif.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPieceJustificatif for edit and NewPieceJustificatifFormGroupInput for create.
 */
type PieceJustificatifFormGroupInput = IPieceJustificatif | PartialWithRequiredKeyOf<NewPieceJustificatif>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IPieceJustificatif | NewPieceJustificatif> = Omit<T, 'dateHeureModification' | 'dateHeureCreation'> & {
  dateHeureModification?: string | null;
  dateHeureCreation?: string | null;
};

type PieceJustificatifFormRawValue = FormValueOf<IPieceJustificatif>;

type NewPieceJustificatifFormRawValue = FormValueOf<NewPieceJustificatif>;

type PieceJustificatifFormDefaults = Pick<NewPieceJustificatif, 'id' | 'dateHeureModification' | 'dateHeureCreation'>;

type PieceJustificatifFormGroupContent = {
  id: FormControl<PieceJustificatifFormRawValue['id'] | NewPieceJustificatif['id']>;
  libelle: FormControl<PieceJustificatifFormRawValue['libelle']>;
  piece: FormControl<PieceJustificatifFormRawValue['piece']>;
  pieceContentType: FormControl<PieceJustificatifFormRawValue['pieceContentType']>;
  dateHeureModification: FormControl<PieceJustificatifFormRawValue['dateHeureModification']>;
  dateHeureCreation: FormControl<PieceJustificatifFormRawValue['dateHeureCreation']>;
  utiCree: FormControl<PieceJustificatifFormRawValue['utiCree']>;
  utiModifie: FormControl<PieceJustificatifFormRawValue['utiModifie']>;
  operation: FormControl<PieceJustificatifFormRawValue['operation']>;
};

export type PieceJustificatifFormGroup = FormGroup<PieceJustificatifFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PieceJustificatifFormService {
  createPieceJustificatifFormGroup(pieceJustificatif: PieceJustificatifFormGroupInput = { id: null }): PieceJustificatifFormGroup {
    const pieceJustificatifRawValue = this.convertPieceJustificatifToPieceJustificatifRawValue({
      ...this.getFormDefaults(),
      ...pieceJustificatif,
    });
    return new FormGroup<PieceJustificatifFormGroupContent>({
      id: new FormControl(
        { value: pieceJustificatifRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      libelle: new FormControl(pieceJustificatifRawValue.libelle),
      piece: new FormControl(pieceJustificatifRawValue.piece),
      pieceContentType: new FormControl(pieceJustificatifRawValue.pieceContentType),
      dateHeureModification: new FormControl(pieceJustificatifRawValue.dateHeureModification),
      dateHeureCreation: new FormControl(pieceJustificatifRawValue.dateHeureCreation),
      utiCree: new FormControl(pieceJustificatifRawValue.utiCree),
      utiModifie: new FormControl(pieceJustificatifRawValue.utiModifie),
      operation: new FormControl(pieceJustificatifRawValue.operation),
    });
  }

  getPieceJustificatif(form: PieceJustificatifFormGroup): IPieceJustificatif | NewPieceJustificatif {
    return this.convertPieceJustificatifRawValueToPieceJustificatif(
      form.getRawValue() as PieceJustificatifFormRawValue | NewPieceJustificatifFormRawValue,
    );
  }

  resetForm(form: PieceJustificatifFormGroup, pieceJustificatif: PieceJustificatifFormGroupInput): void {
    const pieceJustificatifRawValue = this.convertPieceJustificatifToPieceJustificatifRawValue({
      ...this.getFormDefaults(),
      ...pieceJustificatif,
    });
    form.reset(
      {
        ...pieceJustificatifRawValue,
        id: { value: pieceJustificatifRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): PieceJustificatifFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dateHeureModification: currentTime,
      dateHeureCreation: currentTime,
    };
  }

  private convertPieceJustificatifRawValueToPieceJustificatif(
    rawPieceJustificatif: PieceJustificatifFormRawValue | NewPieceJustificatifFormRawValue,
  ): IPieceJustificatif | NewPieceJustificatif {
    return {
      ...rawPieceJustificatif,
      dateHeureModification: dayjs(rawPieceJustificatif.dateHeureModification, DATE_TIME_FORMAT),
      dateHeureCreation: dayjs(rawPieceJustificatif.dateHeureCreation, DATE_TIME_FORMAT),
    };
  }

  private convertPieceJustificatifToPieceJustificatifRawValue(
    pieceJustificatif: IPieceJustificatif | (Partial<NewPieceJustificatif> & PieceJustificatifFormDefaults),
  ): PieceJustificatifFormRawValue | PartialWithRequiredKeyOf<NewPieceJustificatifFormRawValue> {
    return {
      ...pieceJustificatif,
      dateHeureModification: pieceJustificatif.dateHeureModification
        ? pieceJustificatif.dateHeureModification.format(DATE_TIME_FORMAT)
        : undefined,
      dateHeureCreation: pieceJustificatif.dateHeureCreation ? pieceJustificatif.dateHeureCreation.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
