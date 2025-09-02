import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEtablissement, NewEtablissement } from '../etablissement.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEtablissement for edit and NewEtablissementFormGroupInput for create.
 */
type EtablissementFormGroupInput = IEtablissement | PartialWithRequiredKeyOf<NewEtablissement>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IEtablissement | NewEtablissement> = Omit<T, 'dateHeureModification' | 'dateHeureCreation'> & {
  dateHeureModification?: string | null;
  dateHeureCreation?: string | null;
};

type EtablissementFormRawValue = FormValueOf<IEtablissement>;

type NewEtablissementFormRawValue = FormValueOf<NewEtablissement>;

type EtablissementFormDefaults = Pick<NewEtablissement, 'id' | 'dateHeureModification' | 'dateHeureCreation'>;

type EtablissementFormGroupContent = {
  id: FormControl<EtablissementFormRawValue['id'] | NewEtablissement['id']>;
  libelle: FormControl<EtablissementFormRawValue['libelle']>;
  sigle: FormControl<EtablissementFormRawValue['sigle']>;
  dateHeureModification: FormControl<EtablissementFormRawValue['dateHeureModification']>;
  dateHeureCreation: FormControl<EtablissementFormRawValue['dateHeureCreation']>;
  utiCree: FormControl<EtablissementFormRawValue['utiCree']>;
  utiModifie: FormControl<EtablissementFormRawValue['utiModifie']>;
};

export type EtablissementFormGroup = FormGroup<EtablissementFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EtablissementFormService {
  createEtablissementFormGroup(etablissement: EtablissementFormGroupInput = { id: null }): EtablissementFormGroup {
    const etablissementRawValue = this.convertEtablissementToEtablissementRawValue({
      ...this.getFormDefaults(),
      ...etablissement,
    });
    return new FormGroup<EtablissementFormGroupContent>({
      id: new FormControl(
        { value: etablissementRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      libelle: new FormControl(etablissementRawValue.libelle, {
        validators: [Validators.required],
      }),
      sigle: new FormControl(etablissementRawValue.sigle, {
        validators: [Validators.required],
      }),
      dateHeureModification: new FormControl(etablissementRawValue.dateHeureModification),
      dateHeureCreation: new FormControl(etablissementRawValue.dateHeureCreation),
      utiCree: new FormControl(etablissementRawValue.utiCree),
      utiModifie: new FormControl(etablissementRawValue.utiModifie),
    });
  }

  getEtablissement(form: EtablissementFormGroup): IEtablissement | NewEtablissement {
    return this.convertEtablissementRawValueToEtablissement(form.getRawValue() as EtablissementFormRawValue | NewEtablissementFormRawValue);
  }

  resetForm(form: EtablissementFormGroup, etablissement: EtablissementFormGroupInput): void {
    const etablissementRawValue = this.convertEtablissementToEtablissementRawValue({ ...this.getFormDefaults(), ...etablissement });
    form.reset(
      {
        ...etablissementRawValue,
        id: { value: etablissementRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): EtablissementFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dateHeureModification: currentTime,
      dateHeureCreation: currentTime,
    };
  }

  private convertEtablissementRawValueToEtablissement(
    rawEtablissement: EtablissementFormRawValue | NewEtablissementFormRawValue,
  ): IEtablissement | NewEtablissement {
    return {
      ...rawEtablissement,
      dateHeureModification: dayjs(rawEtablissement.dateHeureModification, DATE_TIME_FORMAT),
      dateHeureCreation: dayjs(rawEtablissement.dateHeureCreation, DATE_TIME_FORMAT),
    };
  }

  private convertEtablissementToEtablissementRawValue(
    etablissement: IEtablissement | (Partial<NewEtablissement> & EtablissementFormDefaults),
  ): EtablissementFormRawValue | PartialWithRequiredKeyOf<NewEtablissementFormRawValue> {
    return {
      ...etablissement,
      dateHeureModification: etablissement.dateHeureModification ? etablissement.dateHeureModification.format(DATE_TIME_FORMAT) : undefined,
      dateHeureCreation: etablissement.dateHeureCreation ? etablissement.dateHeureCreation.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
