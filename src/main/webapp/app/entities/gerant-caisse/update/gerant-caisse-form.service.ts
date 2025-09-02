import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IGerantCaisse, NewGerantCaisse } from '../gerant-caisse.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IGerantCaisse for edit and NewGerantCaisseFormGroupInput for create.
 */
type GerantCaisseFormGroupInput = IGerantCaisse | PartialWithRequiredKeyOf<NewGerantCaisse>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IGerantCaisse | NewGerantCaisse> = Omit<T, 'dateHeureModification' | 'dateHeureCreation'> & {
  dateHeureModification?: string | null;
  dateHeureCreation?: string | null;
};

type GerantCaisseFormRawValue = FormValueOf<IGerantCaisse>;

type NewGerantCaisseFormRawValue = FormValueOf<NewGerantCaisse>;

type GerantCaisseFormDefaults = Pick<NewGerantCaisse, 'id' | 'actif' | 'dateHeureModification' | 'dateHeureCreation'>;

type GerantCaisseFormGroupContent = {
  id: FormControl<GerantCaisseFormRawValue['id'] | NewGerantCaisse['id']>;
  actif: FormControl<GerantCaisseFormRawValue['actif']>;
  dateHeureModification: FormControl<GerantCaisseFormRawValue['dateHeureModification']>;
  dateHeureCreation: FormControl<GerantCaisseFormRawValue['dateHeureCreation']>;
  utiCree: FormControl<GerantCaisseFormRawValue['utiCree']>;
  utiModifie: FormControl<GerantCaisseFormRawValue['utiModifie']>;
  caisse: FormControl<GerantCaisseFormRawValue['caisse']>;
  gerant: FormControl<GerantCaisseFormRawValue['gerant']>;
};

export type GerantCaisseFormGroup = FormGroup<GerantCaisseFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class GerantCaisseFormService {
  createGerantCaisseFormGroup(gerantCaisse: GerantCaisseFormGroupInput = { id: null }): GerantCaisseFormGroup {
    const gerantCaisseRawValue = this.convertGerantCaisseToGerantCaisseRawValue({
      ...this.getFormDefaults(),
      ...gerantCaisse,
    });
    return new FormGroup<GerantCaisseFormGroupContent>({
      id: new FormControl(
        { value: gerantCaisseRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      actif: new FormControl(gerantCaisseRawValue.actif),
      dateHeureModification: new FormControl(gerantCaisseRawValue.dateHeureModification),
      dateHeureCreation: new FormControl(gerantCaisseRawValue.dateHeureCreation),
      utiCree: new FormControl(gerantCaisseRawValue.utiCree),
      utiModifie: new FormControl(gerantCaisseRawValue.utiModifie),
      caisse: new FormControl(gerantCaisseRawValue.caisse),
      gerant: new FormControl(gerantCaisseRawValue.gerant),
    });
  }

  getGerantCaisse(form: GerantCaisseFormGroup): IGerantCaisse | NewGerantCaisse {
    return this.convertGerantCaisseRawValueToGerantCaisse(form.getRawValue() as GerantCaisseFormRawValue | NewGerantCaisseFormRawValue);
  }

  resetForm(form: GerantCaisseFormGroup, gerantCaisse: GerantCaisseFormGroupInput): void {
    const gerantCaisseRawValue = this.convertGerantCaisseToGerantCaisseRawValue({ ...this.getFormDefaults(), ...gerantCaisse });
    form.reset(
      {
        ...gerantCaisseRawValue,
        id: { value: gerantCaisseRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): GerantCaisseFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      actif: false,
      dateHeureModification: currentTime,
      dateHeureCreation: currentTime,
    };
  }

  private convertGerantCaisseRawValueToGerantCaisse(
    rawGerantCaisse: GerantCaisseFormRawValue | NewGerantCaisseFormRawValue,
  ): IGerantCaisse | NewGerantCaisse {
    return {
      ...rawGerantCaisse,
      dateHeureModification: dayjs(rawGerantCaisse.dateHeureModification, DATE_TIME_FORMAT),
      dateHeureCreation: dayjs(rawGerantCaisse.dateHeureCreation, DATE_TIME_FORMAT),
    };
  }

  private convertGerantCaisseToGerantCaisseRawValue(
    gerantCaisse: IGerantCaisse | (Partial<NewGerantCaisse> & GerantCaisseFormDefaults),
  ): GerantCaisseFormRawValue | PartialWithRequiredKeyOf<NewGerantCaisseFormRawValue> {
    return {
      ...gerantCaisse,
      dateHeureModification: gerantCaisse.dateHeureModification ? gerantCaisse.dateHeureModification.format(DATE_TIME_FORMAT) : undefined,
      dateHeureCreation: gerantCaisse.dateHeureCreation ? gerantCaisse.dateHeureCreation.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
