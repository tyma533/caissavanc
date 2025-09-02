import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IRubrique, NewRubrique } from '../rubrique.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IRubrique for edit and NewRubriqueFormGroupInput for create.
 */
type RubriqueFormGroupInput = IRubrique | PartialWithRequiredKeyOf<NewRubrique>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IRubrique | NewRubrique> = Omit<T, 'dateHeureModification' | 'dateHeureCreation'> & {
  dateHeureModification?: string | null;
  dateHeureCreation?: string | null;
};

type RubriqueFormRawValue = FormValueOf<IRubrique>;

type NewRubriqueFormRawValue = FormValueOf<NewRubrique>;

type RubriqueFormDefaults = Pick<NewRubrique, 'id' | 'dateHeureModification' | 'dateHeureCreation'>;

type RubriqueFormGroupContent = {
  id: FormControl<RubriqueFormRawValue['id'] | NewRubrique['id']>;
  libelle: FormControl<RubriqueFormRawValue['libelle']>;
  description: FormControl<RubriqueFormRawValue['description']>;
  code: FormControl<RubriqueFormRawValue['code']>;
  dateHeureModification: FormControl<RubriqueFormRawValue['dateHeureModification']>;
  dateHeureCreation: FormControl<RubriqueFormRawValue['dateHeureCreation']>;
  utiCree: FormControl<RubriqueFormRawValue['utiCree']>;
  utiModifie: FormControl<RubriqueFormRawValue['utiModifie']>;
};

export type RubriqueFormGroup = FormGroup<RubriqueFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class RubriqueFormService {
  createRubriqueFormGroup(rubrique: RubriqueFormGroupInput = { id: null }): RubriqueFormGroup {
    const rubriqueRawValue = this.convertRubriqueToRubriqueRawValue({
      ...this.getFormDefaults(),
      ...rubrique,
    });
    return new FormGroup<RubriqueFormGroupContent>({
      id: new FormControl(
        { value: rubriqueRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      libelle: new FormControl(rubriqueRawValue.libelle),
      description: new FormControl(rubriqueRawValue.description),
      code: new FormControl(rubriqueRawValue.code),
      dateHeureModification: new FormControl(rubriqueRawValue.dateHeureModification),
      dateHeureCreation: new FormControl(rubriqueRawValue.dateHeureCreation),
      utiCree: new FormControl(rubriqueRawValue.utiCree),
      utiModifie: new FormControl(rubriqueRawValue.utiModifie),
    });
  }

  getRubrique(form: RubriqueFormGroup): IRubrique | NewRubrique {
    return this.convertRubriqueRawValueToRubrique(form.getRawValue() as RubriqueFormRawValue | NewRubriqueFormRawValue);
  }

  resetForm(form: RubriqueFormGroup, rubrique: RubriqueFormGroupInput): void {
    const rubriqueRawValue = this.convertRubriqueToRubriqueRawValue({ ...this.getFormDefaults(), ...rubrique });
    form.reset(
      {
        ...rubriqueRawValue,
        id: { value: rubriqueRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): RubriqueFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dateHeureModification: currentTime,
      dateHeureCreation: currentTime,
    };
  }

  private convertRubriqueRawValueToRubrique(rawRubrique: RubriqueFormRawValue | NewRubriqueFormRawValue): IRubrique | NewRubrique {
    return {
      ...rawRubrique,
      dateHeureModification: dayjs(rawRubrique.dateHeureModification, DATE_TIME_FORMAT),
      dateHeureCreation: dayjs(rawRubrique.dateHeureCreation, DATE_TIME_FORMAT),
    };
  }

  private convertRubriqueToRubriqueRawValue(
    rubrique: IRubrique | (Partial<NewRubrique> & RubriqueFormDefaults),
  ): RubriqueFormRawValue | PartialWithRequiredKeyOf<NewRubriqueFormRawValue> {
    return {
      ...rubrique,
      dateHeureModification: rubrique.dateHeureModification ? rubrique.dateHeureModification.format(DATE_TIME_FORMAT) : undefined,
      dateHeureCreation: rubrique.dateHeureCreation ? rubrique.dateHeureCreation.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
