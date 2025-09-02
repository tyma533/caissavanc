import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IModeOperation, NewModeOperation } from '../mode-operation.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IModeOperation for edit and NewModeOperationFormGroupInput for create.
 */
type ModeOperationFormGroupInput = IModeOperation | PartialWithRequiredKeyOf<NewModeOperation>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IModeOperation | NewModeOperation> = Omit<T, 'dateHeureModification' | 'dateHeureCreation'> & {
  dateHeureModification?: string | null;
  dateHeureCreation?: string | null;
};

type ModeOperationFormRawValue = FormValueOf<IModeOperation>;

type NewModeOperationFormRawValue = FormValueOf<NewModeOperation>;

type ModeOperationFormDefaults = Pick<NewModeOperation, 'id' | 'dateHeureModification' | 'dateHeureCreation'>;

type ModeOperationFormGroupContent = {
  id: FormControl<ModeOperationFormRawValue['id'] | NewModeOperation['id']>;
  libelle: FormControl<ModeOperationFormRawValue['libelle']>;
  dateHeureModification: FormControl<ModeOperationFormRawValue['dateHeureModification']>;
  dateHeureCreation: FormControl<ModeOperationFormRawValue['dateHeureCreation']>;
  utiCree: FormControl<ModeOperationFormRawValue['utiCree']>;
  utiModifie: FormControl<ModeOperationFormRawValue['utiModifie']>;
};

export type ModeOperationFormGroup = FormGroup<ModeOperationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ModeOperationFormService {
  createModeOperationFormGroup(modeOperation: ModeOperationFormGroupInput = { id: null }): ModeOperationFormGroup {
    const modeOperationRawValue = this.convertModeOperationToModeOperationRawValue({
      ...this.getFormDefaults(),
      ...modeOperation,
    });
    return new FormGroup<ModeOperationFormGroupContent>({
      id: new FormControl(
        { value: modeOperationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      libelle: new FormControl(modeOperationRawValue.libelle),
      dateHeureModification: new FormControl(modeOperationRawValue.dateHeureModification),
      dateHeureCreation: new FormControl(modeOperationRawValue.dateHeureCreation),
      utiCree: new FormControl(modeOperationRawValue.utiCree),
      utiModifie: new FormControl(modeOperationRawValue.utiModifie),
    });
  }

  getModeOperation(form: ModeOperationFormGroup): IModeOperation | NewModeOperation {
    return this.convertModeOperationRawValueToModeOperation(form.getRawValue() as ModeOperationFormRawValue | NewModeOperationFormRawValue);
  }

  resetForm(form: ModeOperationFormGroup, modeOperation: ModeOperationFormGroupInput): void {
    const modeOperationRawValue = this.convertModeOperationToModeOperationRawValue({ ...this.getFormDefaults(), ...modeOperation });
    form.reset(
      {
        ...modeOperationRawValue,
        id: { value: modeOperationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ModeOperationFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dateHeureModification: currentTime,
      dateHeureCreation: currentTime,
    };
  }

  private convertModeOperationRawValueToModeOperation(
    rawModeOperation: ModeOperationFormRawValue | NewModeOperationFormRawValue,
  ): IModeOperation | NewModeOperation {
    return {
      ...rawModeOperation,
      dateHeureModification: dayjs(rawModeOperation.dateHeureModification, DATE_TIME_FORMAT),
      dateHeureCreation: dayjs(rawModeOperation.dateHeureCreation, DATE_TIME_FORMAT),
    };
  }

  private convertModeOperationToModeOperationRawValue(
    modeOperation: IModeOperation | (Partial<NewModeOperation> & ModeOperationFormDefaults),
  ): ModeOperationFormRawValue | PartialWithRequiredKeyOf<NewModeOperationFormRawValue> {
    return {
      ...modeOperation,
      dateHeureModification: modeOperation.dateHeureModification ? modeOperation.dateHeureModification.format(DATE_TIME_FORMAT) : undefined,
      dateHeureCreation: modeOperation.dateHeureCreation ? modeOperation.dateHeureCreation.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
