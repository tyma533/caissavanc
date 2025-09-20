import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IOperation, NewOperation } from '../operation.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IOperation for edit and NewOperationFormGroupInput for create.
 */
type OperationFormGroupInput = IOperation | PartialWithRequiredKeyOf<NewOperation>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IOperation | NewOperation> = Omit<T, 'dateOperation' | 'dateHeureModification' | 'dateHeureCreation'> & {
  dateOperation?: string | null;
  dateHeureModification?: string | null;
  dateHeureCreation?: string | null;
};

type OperationFormRawValue = FormValueOf<IOperation>;

type NewOperationFormRawValue = FormValueOf<NewOperation>;

type OperationFormDefaults = Pick<NewOperation, 'id' | 'dateOperation' | 'dateHeureModification' | 'dateHeureCreation'>;

type OperationFormGroupContent = {
  id: FormControl<OperationFormRawValue['id'] | NewOperation['id']>;
  numero: FormControl<OperationFormRawValue['numero']>;
  commentaire: FormControl<OperationFormRawValue['commentaire']>;
  montant: FormControl<OperationFormRawValue['montant']>;
  dateOperation: FormControl<OperationFormRawValue['dateOperation']>;
  dateHeureModification: FormControl<OperationFormRawValue['dateHeureModification']>;
  dateHeureCreation: FormControl<OperationFormRawValue['dateHeureCreation']>;
  utiCree: FormControl<OperationFormRawValue['utiCree']>;
  utiModifie: FormControl<OperationFormRawValue['utiModifie']>;
  caisse: FormControl<OperationFormRawValue['caisse']>;
  typeOperation: FormControl<OperationFormRawValue['typeOperation']>;
  modeOperation: FormControl<OperationFormRawValue['modeOperation']>;
  beneficiaire: FormControl<OperationFormRawValue['beneficiaire']>;
  banque: FormControl<OperationFormRawValue['banque']>;
  crediteur: FormControl<OperationFormRawValue['crediteur']>;
  numeroVC: FormControl<OperationFormRawValue['numeroVC']>;
};

export type OperationFormGroup = FormGroup<OperationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class OperationFormService {
  createOperationFormGroup(operation: OperationFormGroupInput = { id: null }): OperationFormGroup {
    const operationRawValue = this.convertOperationToOperationRawValue({
      ...this.getFormDefaults(),
      ...operation,
    });
    return new FormGroup<OperationFormGroupContent>({
      id: new FormControl(
        { value: operationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      numero: new FormControl(operationRawValue.numero, {
        validators: [Validators.required],
      }),
      commentaire: new FormControl(operationRawValue.commentaire, {
        validators: [Validators.required],
      }),
      montant: new FormControl(operationRawValue.montant, {
        validators: [Validators.required],
      }),
      dateOperation: new FormControl(operationRawValue.dateOperation),
      dateHeureModification: new FormControl(operationRawValue.dateHeureModification),
      dateHeureCreation: new FormControl(operationRawValue.dateHeureCreation),
      utiCree: new FormControl(operationRawValue.utiCree),
      utiModifie: new FormControl(operationRawValue.utiModifie),
      caisse: new FormControl(operationRawValue.caisse),
      typeOperation: new FormControl(operationRawValue.typeOperation),
      modeOperation: new FormControl(operationRawValue.modeOperation),
      beneficiaire: new FormControl(operationRawValue.beneficiaire),
      banque: new FormControl(operationRawValue.banque),
      crediteur: new FormControl(operationRawValue.crediteur),
      numeroVC: new FormControl(operationRawValue.numeroVC),
    });
  }

  getOperation(form: OperationFormGroup): IOperation | NewOperation {
    return this.convertOperationRawValueToOperation(form.getRawValue() as OperationFormRawValue | NewOperationFormRawValue);
  }

  resetForm(form: OperationFormGroup, operation: OperationFormGroupInput): void {
    const operationRawValue = this.convertOperationToOperationRawValue({ ...this.getFormDefaults(), ...operation });
    form.reset(
      {
        ...operationRawValue,
        id: { value: operationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): OperationFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dateOperation: currentTime,
      dateHeureModification: currentTime,
      dateHeureCreation: currentTime,
    };
  }

  private convertOperationRawValueToOperation(rawOperation: OperationFormRawValue | NewOperationFormRawValue): IOperation | NewOperation {
    return {
      ...rawOperation,
      dateOperation: dayjs(rawOperation.dateOperation, DATE_TIME_FORMAT),
      dateHeureModification: dayjs(rawOperation.dateHeureModification, DATE_TIME_FORMAT),
      dateHeureCreation: dayjs(rawOperation.dateHeureCreation, DATE_TIME_FORMAT),
    };
  }

  private convertOperationToOperationRawValue(
    operation: IOperation | (Partial<NewOperation> & OperationFormDefaults),
  ): OperationFormRawValue | PartialWithRequiredKeyOf<NewOperationFormRawValue> {
    return {
      ...operation,
      dateOperation: operation.dateOperation ? operation.dateOperation.format(DATE_TIME_FORMAT) : undefined,
      dateHeureModification: operation.dateHeureModification ? operation.dateHeureModification.format(DATE_TIME_FORMAT) : undefined,
      dateHeureCreation: operation.dateHeureCreation ? operation.dateHeureCreation.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
