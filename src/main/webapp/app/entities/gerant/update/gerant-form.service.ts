import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IGerant, NewGerant } from '../gerant.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IGerant for edit and NewGerantFormGroupInput for create.
 */
type GerantFormGroupInput = IGerant | PartialWithRequiredKeyOf<NewGerant>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IGerant | NewGerant> = Omit<T, 'dateNomination' | 'dateFin' | 'dateHeureModification' | 'dateHeureCreation'> & {
  dateNomination?: string | null;
  dateFin?: string | null;
  dateHeureModification?: string | null;
  dateHeureCreation?: string | null;
};

type GerantFormRawValue = FormValueOf<IGerant>;

type NewGerantFormRawValue = FormValueOf<NewGerant>;

type GerantFormDefaults = Pick<NewGerant, 'id' | 'dateNomination' | 'dateFin' | 'dateHeureModification' | 'dateHeureCreation'>;

type GerantFormGroupContent = {
  id: FormControl<GerantFormRawValue['id'] | NewGerant['id']>;
  nom: FormControl<GerantFormRawValue['nom']>;
  dateNomination: FormControl<GerantFormRawValue['dateNomination']>;
  dateFin: FormControl<GerantFormRawValue['dateFin']>;
  dateHeureModification: FormControl<GerantFormRawValue['dateHeureModification']>;
  dateHeureCreation: FormControl<GerantFormRawValue['dateHeureCreation']>;
  utiCree: FormControl<GerantFormRawValue['utiCree']>;
  utiModifie: FormControl<GerantFormRawValue['utiModifie']>;
  agentEtatProfil: FormControl<GerantFormRawValue['agentEtatProfil']>;
};

export type GerantFormGroup = FormGroup<GerantFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class GerantFormService {
  createGerantFormGroup(gerant: GerantFormGroupInput = { id: null }): GerantFormGroup {
    const gerantRawValue = this.convertGerantToGerantRawValue({
      ...this.getFormDefaults(),
      ...gerant,
    });
    return new FormGroup<GerantFormGroupContent>({
      id: new FormControl(
        { value: gerantRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nom: new FormControl(gerantRawValue.nom),
      dateNomination: new FormControl(gerantRawValue.dateNomination),
      dateFin: new FormControl(gerantRawValue.dateFin),
      dateHeureModification: new FormControl(gerantRawValue.dateHeureModification),
      dateHeureCreation: new FormControl(gerantRawValue.dateHeureCreation),
      utiCree: new FormControl(gerantRawValue.utiCree),
      utiModifie: new FormControl(gerantRawValue.utiModifie),
      agentEtatProfil: new FormControl(gerantRawValue.agentEtatProfil),
    });
  }

  getGerant(form: GerantFormGroup): IGerant | NewGerant {
    return this.convertGerantRawValueToGerant(form.getRawValue() as GerantFormRawValue | NewGerantFormRawValue);
  }

  resetForm(form: GerantFormGroup, gerant: GerantFormGroupInput): void {
    const gerantRawValue = this.convertGerantToGerantRawValue({ ...this.getFormDefaults(), ...gerant });
    form.reset(
      {
        ...gerantRawValue,
        id: { value: gerantRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): GerantFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dateNomination: currentTime,
      dateFin: currentTime,
      dateHeureModification: currentTime,
      dateHeureCreation: currentTime,
    };
  }

  private convertGerantRawValueToGerant(rawGerant: GerantFormRawValue | NewGerantFormRawValue): IGerant | NewGerant {
    return {
      ...rawGerant,
      dateNomination: dayjs(rawGerant.dateNomination, DATE_TIME_FORMAT),
      dateFin: dayjs(rawGerant.dateFin, DATE_TIME_FORMAT),
      dateHeureModification: dayjs(rawGerant.dateHeureModification, DATE_TIME_FORMAT),
      dateHeureCreation: dayjs(rawGerant.dateHeureCreation, DATE_TIME_FORMAT),
    };
  }

  private convertGerantToGerantRawValue(
    gerant: IGerant | (Partial<NewGerant> & GerantFormDefaults),
  ): GerantFormRawValue | PartialWithRequiredKeyOf<NewGerantFormRawValue> {
    return {
      ...gerant,
      dateNomination: gerant.dateNomination ? gerant.dateNomination.format(DATE_TIME_FORMAT) : undefined,
      dateFin: gerant.dateFin ? gerant.dateFin.format(DATE_TIME_FORMAT) : undefined,
      dateHeureModification: gerant.dateHeureModification ? gerant.dateHeureModification.format(DATE_TIME_FORMAT) : undefined,
      dateHeureCreation: gerant.dateHeureCreation ? gerant.dateHeureCreation.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
