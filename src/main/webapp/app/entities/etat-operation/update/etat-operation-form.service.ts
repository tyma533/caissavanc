import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEtatOperation, NewEtatOperation } from '../etat-operation.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEtatOperation for edit and NewEtatOperationFormGroupInput for create.
 */
type EtatOperationFormGroupInput = IEtatOperation | PartialWithRequiredKeyOf<NewEtatOperation>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IEtatOperation | NewEtatOperation> = Omit<T, 'dateHeureModification' | 'dateHeureCreation'> & {
  dateHeureModification?: string | null;
  dateHeureCreation?: string | null;
};

type EtatOperationFormRawValue = FormValueOf<IEtatOperation>;

type NewEtatOperationFormRawValue = FormValueOf<NewEtatOperation>;

type EtatOperationFormDefaults = Pick<NewEtatOperation, 'id' | 'dateHeureModification' | 'dateHeureCreation'>;

type EtatOperationFormGroupContent = {
  id: FormControl<EtatOperationFormRawValue['id'] | NewEtatOperation['id']>;
  libelle: FormControl<EtatOperationFormRawValue['libelle']>;
  dateHeureModification: FormControl<EtatOperationFormRawValue['dateHeureModification']>;
  dateHeureCreation: FormControl<EtatOperationFormRawValue['dateHeureCreation']>;
  utiCree: FormControl<EtatOperationFormRawValue['utiCree']>;
  utiModifie: FormControl<EtatOperationFormRawValue['utiModifie']>;
};

export type EtatOperationFormGroup = FormGroup<EtatOperationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EtatOperationFormService {
  createEtatOperationFormGroup(etatOperation: EtatOperationFormGroupInput = { id: null }): EtatOperationFormGroup {
    const etatOperationRawValue = this.convertEtatOperationToEtatOperationRawValue({
      ...this.getFormDefaults(),
      ...etatOperation,
    });
    return new FormGroup<EtatOperationFormGroupContent>({
      id: new FormControl(
        { value: etatOperationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      libelle: new FormControl(etatOperationRawValue.libelle),
      dateHeureModification: new FormControl(etatOperationRawValue.dateHeureModification),
      dateHeureCreation: new FormControl(etatOperationRawValue.dateHeureCreation),
      utiCree: new FormControl(etatOperationRawValue.utiCree),
      utiModifie: new FormControl(etatOperationRawValue.utiModifie),
    });
  }

  getEtatOperation(form: EtatOperationFormGroup): IEtatOperation | NewEtatOperation {
    return this.convertEtatOperationRawValueToEtatOperation(form.getRawValue() as EtatOperationFormRawValue | NewEtatOperationFormRawValue);
  }

  resetForm(form: EtatOperationFormGroup, etatOperation: EtatOperationFormGroupInput): void {
    const etatOperationRawValue = this.convertEtatOperationToEtatOperationRawValue({ ...this.getFormDefaults(), ...etatOperation });
    form.reset(
      {
        ...etatOperationRawValue,
        id: { value: etatOperationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): EtatOperationFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dateHeureModification: currentTime,
      dateHeureCreation: currentTime,
    };
  }

  private convertEtatOperationRawValueToEtatOperation(
    rawEtatOperation: EtatOperationFormRawValue | NewEtatOperationFormRawValue,
  ): IEtatOperation | NewEtatOperation {
    return {
      ...rawEtatOperation,
      dateHeureModification: dayjs(rawEtatOperation.dateHeureModification, DATE_TIME_FORMAT),
      dateHeureCreation: dayjs(rawEtatOperation.dateHeureCreation, DATE_TIME_FORMAT),
    };
  }

  private convertEtatOperationToEtatOperationRawValue(
    etatOperation: IEtatOperation | (Partial<NewEtatOperation> & EtatOperationFormDefaults),
  ): EtatOperationFormRawValue | PartialWithRequiredKeyOf<NewEtatOperationFormRawValue> {
    return {
      ...etatOperation,
      dateHeureModification: etatOperation.dateHeureModification ? etatOperation.dateHeureModification.format(DATE_TIME_FORMAT) : undefined,
      dateHeureCreation: etatOperation.dateHeureCreation ? etatOperation.dateHeureCreation.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
