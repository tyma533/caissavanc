import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ITypeOperation, NewTypeOperation } from '../type-operation.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITypeOperation for edit and NewTypeOperationFormGroupInput for create.
 */
type TypeOperationFormGroupInput = ITypeOperation | PartialWithRequiredKeyOf<NewTypeOperation>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ITypeOperation | NewTypeOperation> = Omit<T, 'dateHeureModification' | 'dateHeureCreation'> & {
  dateHeureModification?: string | null;
  dateHeureCreation?: string | null;
};

type TypeOperationFormRawValue = FormValueOf<ITypeOperation>;

type NewTypeOperationFormRawValue = FormValueOf<NewTypeOperation>;

type TypeOperationFormDefaults = Pick<NewTypeOperation, 'id' | 'dateHeureModification' | 'dateHeureCreation'>;

type TypeOperationFormGroupContent = {
  id: FormControl<TypeOperationFormRawValue['id'] | NewTypeOperation['id']>;
  libelle: FormControl<TypeOperationFormRawValue['libelle']>;
  dateHeureModification: FormControl<TypeOperationFormRawValue['dateHeureModification']>;
  dateHeureCreation: FormControl<TypeOperationFormRawValue['dateHeureCreation']>;
  utiCree: FormControl<TypeOperationFormRawValue['utiCree']>;
  utiModifie: FormControl<TypeOperationFormRawValue['utiModifie']>;
};

export type TypeOperationFormGroup = FormGroup<TypeOperationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TypeOperationFormService {
  createTypeOperationFormGroup(typeOperation: TypeOperationFormGroupInput = { id: null }): TypeOperationFormGroup {
    const typeOperationRawValue = this.convertTypeOperationToTypeOperationRawValue({
      ...this.getFormDefaults(),
      ...typeOperation,
    });
    return new FormGroup<TypeOperationFormGroupContent>({
      id: new FormControl(
        { value: typeOperationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      libelle: new FormControl(typeOperationRawValue.libelle),
      dateHeureModification: new FormControl(typeOperationRawValue.dateHeureModification),
      dateHeureCreation: new FormControl(typeOperationRawValue.dateHeureCreation),
      utiCree: new FormControl(typeOperationRawValue.utiCree),
      utiModifie: new FormControl(typeOperationRawValue.utiModifie),
    });
  }

  getTypeOperation(form: TypeOperationFormGroup): ITypeOperation | NewTypeOperation {
    return this.convertTypeOperationRawValueToTypeOperation(form.getRawValue() as TypeOperationFormRawValue | NewTypeOperationFormRawValue);
  }

  resetForm(form: TypeOperationFormGroup, typeOperation: TypeOperationFormGroupInput): void {
    const typeOperationRawValue = this.convertTypeOperationToTypeOperationRawValue({ ...this.getFormDefaults(), ...typeOperation });
    form.reset(
      {
        ...typeOperationRawValue,
        id: { value: typeOperationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): TypeOperationFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dateHeureModification: currentTime,
      dateHeureCreation: currentTime,
    };
  }

  private convertTypeOperationRawValueToTypeOperation(
    rawTypeOperation: TypeOperationFormRawValue | NewTypeOperationFormRawValue,
  ): ITypeOperation | NewTypeOperation {
    return {
      ...rawTypeOperation,
      dateHeureModification: dayjs(rawTypeOperation.dateHeureModification, DATE_TIME_FORMAT),
      dateHeureCreation: dayjs(rawTypeOperation.dateHeureCreation, DATE_TIME_FORMAT),
    };
  }

  private convertTypeOperationToTypeOperationRawValue(
    typeOperation: ITypeOperation | (Partial<NewTypeOperation> & TypeOperationFormDefaults),
  ): TypeOperationFormRawValue | PartialWithRequiredKeyOf<NewTypeOperationFormRawValue> {
    return {
      ...typeOperation,
      dateHeureModification: typeOperation.dateHeureModification ? typeOperation.dateHeureModification.format(DATE_TIME_FORMAT) : undefined,
      dateHeureCreation: typeOperation.dateHeureCreation ? typeOperation.dateHeureCreation.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
