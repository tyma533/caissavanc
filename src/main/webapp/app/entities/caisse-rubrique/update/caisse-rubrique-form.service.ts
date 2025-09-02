import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ICaisseRubrique, NewCaisseRubrique } from '../caisse-rubrique.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICaisseRubrique for edit and NewCaisseRubriqueFormGroupInput for create.
 */
type CaisseRubriqueFormGroupInput = ICaisseRubrique | PartialWithRequiredKeyOf<NewCaisseRubrique>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ICaisseRubrique | NewCaisseRubrique> = Omit<T, 'dateHeureModification' | 'dateHeureCreation'> & {
  dateHeureModification?: string | null;
  dateHeureCreation?: string | null;
};

type CaisseRubriqueFormRawValue = FormValueOf<ICaisseRubrique>;

type NewCaisseRubriqueFormRawValue = FormValueOf<NewCaisseRubrique>;

type CaisseRubriqueFormDefaults = Pick<NewCaisseRubrique, 'id' | 'dateHeureModification' | 'dateHeureCreation'>;

type CaisseRubriqueFormGroupContent = {
  id: FormControl<CaisseRubriqueFormRawValue['id'] | NewCaisseRubrique['id']>;
  dateHeureModification: FormControl<CaisseRubriqueFormRawValue['dateHeureModification']>;
  dateHeureCreation: FormControl<CaisseRubriqueFormRawValue['dateHeureCreation']>;
  utiCree: FormControl<CaisseRubriqueFormRawValue['utiCree']>;
  utiModifie: FormControl<CaisseRubriqueFormRawValue['utiModifie']>;
  caisse: FormControl<CaisseRubriqueFormRawValue['caisse']>;
  rubrique: FormControl<CaisseRubriqueFormRawValue['rubrique']>;
};

export type CaisseRubriqueFormGroup = FormGroup<CaisseRubriqueFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CaisseRubriqueFormService {
  createCaisseRubriqueFormGroup(caisseRubrique: CaisseRubriqueFormGroupInput = { id: null }): CaisseRubriqueFormGroup {
    const caisseRubriqueRawValue = this.convertCaisseRubriqueToCaisseRubriqueRawValue({
      ...this.getFormDefaults(),
      ...caisseRubrique,
    });
    return new FormGroup<CaisseRubriqueFormGroupContent>({
      id: new FormControl(
        { value: caisseRubriqueRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      dateHeureModification: new FormControl(caisseRubriqueRawValue.dateHeureModification),
      dateHeureCreation: new FormControl(caisseRubriqueRawValue.dateHeureCreation),
      utiCree: new FormControl(caisseRubriqueRawValue.utiCree),
      utiModifie: new FormControl(caisseRubriqueRawValue.utiModifie),
      caisse: new FormControl(caisseRubriqueRawValue.caisse),
      rubrique: new FormControl(caisseRubriqueRawValue.rubrique),
    });
  }

  getCaisseRubrique(form: CaisseRubriqueFormGroup): ICaisseRubrique | NewCaisseRubrique {
    return this.convertCaisseRubriqueRawValueToCaisseRubrique(
      form.getRawValue() as CaisseRubriqueFormRawValue | NewCaisseRubriqueFormRawValue,
    );
  }

  resetForm(form: CaisseRubriqueFormGroup, caisseRubrique: CaisseRubriqueFormGroupInput): void {
    const caisseRubriqueRawValue = this.convertCaisseRubriqueToCaisseRubriqueRawValue({ ...this.getFormDefaults(), ...caisseRubrique });
    form.reset(
      {
        ...caisseRubriqueRawValue,
        id: { value: caisseRubriqueRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): CaisseRubriqueFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dateHeureModification: currentTime,
      dateHeureCreation: currentTime,
    };
  }

  private convertCaisseRubriqueRawValueToCaisseRubrique(
    rawCaisseRubrique: CaisseRubriqueFormRawValue | NewCaisseRubriqueFormRawValue,
  ): ICaisseRubrique | NewCaisseRubrique {
    return {
      ...rawCaisseRubrique,
      dateHeureModification: dayjs(rawCaisseRubrique.dateHeureModification, DATE_TIME_FORMAT),
      dateHeureCreation: dayjs(rawCaisseRubrique.dateHeureCreation, DATE_TIME_FORMAT),
    };
  }

  private convertCaisseRubriqueToCaisseRubriqueRawValue(
    caisseRubrique: ICaisseRubrique | (Partial<NewCaisseRubrique> & CaisseRubriqueFormDefaults),
  ): CaisseRubriqueFormRawValue | PartialWithRequiredKeyOf<NewCaisseRubriqueFormRawValue> {
    return {
      ...caisseRubrique,
      dateHeureModification: caisseRubrique.dateHeureModification
        ? caisseRubrique.dateHeureModification.format(DATE_TIME_FORMAT)
        : undefined,
      dateHeureCreation: caisseRubrique.dateHeureCreation ? caisseRubrique.dateHeureCreation.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
