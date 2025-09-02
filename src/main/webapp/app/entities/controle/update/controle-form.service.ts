import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IControle, NewControle } from '../controle.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IControle for edit and NewControleFormGroupInput for create.
 */
type ControleFormGroupInput = IControle | PartialWithRequiredKeyOf<NewControle>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IControle | NewControle> = Omit<T, 'dateControle' | 'dateHeureModification' | 'dateHeureCreation'> & {
  dateControle?: string | null;
  dateHeureModification?: string | null;
  dateHeureCreation?: string | null;
};

type ControleFormRawValue = FormValueOf<IControle>;

type NewControleFormRawValue = FormValueOf<NewControle>;

type ControleFormDefaults = Pick<NewControle, 'id' | 'dateControle' | 'dateHeureModification' | 'dateHeureCreation'>;

type ControleFormGroupContent = {
  id: FormControl<ControleFormRawValue['id'] | NewControle['id']>;
  dateControle: FormControl<ControleFormRawValue['dateControle']>;
  observation: FormControl<ControleFormRawValue['observation']>;
  dateHeureModification: FormControl<ControleFormRawValue['dateHeureModification']>;
  dateHeureCreation: FormControl<ControleFormRawValue['dateHeureCreation']>;
  utiCree: FormControl<ControleFormRawValue['utiCree']>;
  utiModifie: FormControl<ControleFormRawValue['utiModifie']>;
  caisse: FormControl<ControleFormRawValue['caisse']>;
};

export type ControleFormGroup = FormGroup<ControleFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ControleFormService {
  createControleFormGroup(controle: ControleFormGroupInput = { id: null }): ControleFormGroup {
    const controleRawValue = this.convertControleToControleRawValue({
      ...this.getFormDefaults(),
      ...controle,
    });
    return new FormGroup<ControleFormGroupContent>({
      id: new FormControl(
        { value: controleRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      dateControle: new FormControl(controleRawValue.dateControle),
      observation: new FormControl(controleRawValue.observation),
      dateHeureModification: new FormControl(controleRawValue.dateHeureModification),
      dateHeureCreation: new FormControl(controleRawValue.dateHeureCreation),
      utiCree: new FormControl(controleRawValue.utiCree),
      utiModifie: new FormControl(controleRawValue.utiModifie),
      caisse: new FormControl(controleRawValue.caisse),
    });
  }

  getControle(form: ControleFormGroup): IControle | NewControle {
    return this.convertControleRawValueToControle(form.getRawValue() as ControleFormRawValue | NewControleFormRawValue);
  }

  resetForm(form: ControleFormGroup, controle: ControleFormGroupInput): void {
    const controleRawValue = this.convertControleToControleRawValue({ ...this.getFormDefaults(), ...controle });
    form.reset(
      {
        ...controleRawValue,
        id: { value: controleRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ControleFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dateControle: currentTime,
      dateHeureModification: currentTime,
      dateHeureCreation: currentTime,
    };
  }

  private convertControleRawValueToControle(rawControle: ControleFormRawValue | NewControleFormRawValue): IControle | NewControle {
    return {
      ...rawControle,
      dateControle: dayjs(rawControle.dateControle, DATE_TIME_FORMAT),
      dateHeureModification: dayjs(rawControle.dateHeureModification, DATE_TIME_FORMAT),
      dateHeureCreation: dayjs(rawControle.dateHeureCreation, DATE_TIME_FORMAT),
    };
  }

  private convertControleToControleRawValue(
    controle: IControle | (Partial<NewControle> & ControleFormDefaults),
  ): ControleFormRawValue | PartialWithRequiredKeyOf<NewControleFormRawValue> {
    return {
      ...controle,
      dateControle: controle.dateControle ? controle.dateControle.format(DATE_TIME_FORMAT) : undefined,
      dateHeureModification: controle.dateHeureModification ? controle.dateHeureModification.format(DATE_TIME_FORMAT) : undefined,
      dateHeureCreation: controle.dateHeureCreation ? controle.dateHeureCreation.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
