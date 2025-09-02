import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ICaisse, NewCaisse } from '../caisse.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICaisse for edit and NewCaisseFormGroupInput for create.
 */
type CaisseFormGroupInput = ICaisse | PartialWithRequiredKeyOf<NewCaisse>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ICaisse | NewCaisse> = Omit<
  T,
  'dateCreationCaisse' | 'dateFermiture' | 'dateHeureModification' | 'dateHeureCreation'
> & {
  dateCreationCaisse?: string | null;
  dateFermiture?: string | null;
  dateHeureModification?: string | null;
  dateHeureCreation?: string | null;
};

type CaisseFormRawValue = FormValueOf<ICaisse>;

type NewCaisseFormRawValue = FormValueOf<NewCaisse>;

type CaisseFormDefaults = Pick<NewCaisse, 'id' | 'dateCreationCaisse' | 'dateFermiture' | 'dateHeureModification' | 'dateHeureCreation'>;

type CaisseFormGroupContent = {
  id: FormControl<CaisseFormRawValue['id'] | NewCaisse['id']>;
  libelle: FormControl<CaisseFormRawValue['libelle']>;
  dateCreationCaisse: FormControl<CaisseFormRawValue['dateCreationCaisse']>;
  dateFermiture: FormControl<CaisseFormRawValue['dateFermiture']>;
  solde: FormControl<CaisseFormRawValue['solde']>;
  etat: FormControl<CaisseFormRawValue['etat']>;
  dateHeureModification: FormControl<CaisseFormRawValue['dateHeureModification']>;
  dateHeureCreation: FormControl<CaisseFormRawValue['dateHeureCreation']>;
  utiCree: FormControl<CaisseFormRawValue['utiCree']>;
  utiModifie: FormControl<CaisseFormRawValue['utiModifie']>;
  etablissement: FormControl<CaisseFormRawValue['etablissement']>;
};

export type CaisseFormGroup = FormGroup<CaisseFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CaisseFormService {
  createCaisseFormGroup(caisse: CaisseFormGroupInput = { id: null }): CaisseFormGroup {
    const caisseRawValue = this.convertCaisseToCaisseRawValue({
      ...this.getFormDefaults(),
      ...caisse,
    });
    return new FormGroup<CaisseFormGroupContent>({
      id: new FormControl(
        { value: caisseRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      libelle: new FormControl(caisseRawValue.libelle, {
        validators: [Validators.required],
      }),
      dateCreationCaisse: new FormControl(caisseRawValue.dateCreationCaisse),
      dateFermiture: new FormControl(caisseRawValue.dateFermiture),
      solde: new FormControl(caisseRawValue.solde, {
        validators: [Validators.required],
      }),
      etat: new FormControl(caisseRawValue.etat, {
        validators: [Validators.required],
      }),
      dateHeureModification: new FormControl(caisseRawValue.dateHeureModification),
      dateHeureCreation: new FormControl(caisseRawValue.dateHeureCreation),
      utiCree: new FormControl(caisseRawValue.utiCree),
      utiModifie: new FormControl(caisseRawValue.utiModifie),
      etablissement: new FormControl(caisseRawValue.etablissement),
    });
  }

  getCaisse(form: CaisseFormGroup): ICaisse | NewCaisse {
    return this.convertCaisseRawValueToCaisse(form.getRawValue() as CaisseFormRawValue | NewCaisseFormRawValue);
  }

  resetForm(form: CaisseFormGroup, caisse: CaisseFormGroupInput): void {
    const caisseRawValue = this.convertCaisseToCaisseRawValue({ ...this.getFormDefaults(), ...caisse });
    form.reset(
      {
        ...caisseRawValue,
        id: { value: caisseRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): CaisseFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dateCreationCaisse: currentTime,
      dateFermiture: currentTime,
      dateHeureModification: currentTime,
      dateHeureCreation: currentTime,
    };
  }

  private convertCaisseRawValueToCaisse(rawCaisse: CaisseFormRawValue | NewCaisseFormRawValue): ICaisse | NewCaisse {
    return {
      ...rawCaisse,
      dateCreationCaisse: dayjs(rawCaisse.dateCreationCaisse, DATE_TIME_FORMAT),
      dateFermiture: dayjs(rawCaisse.dateFermiture, DATE_TIME_FORMAT),
      dateHeureModification: dayjs(rawCaisse.dateHeureModification, DATE_TIME_FORMAT),
      dateHeureCreation: dayjs(rawCaisse.dateHeureCreation, DATE_TIME_FORMAT),
    };
  }

  private convertCaisseToCaisseRawValue(
    caisse: ICaisse | (Partial<NewCaisse> & CaisseFormDefaults),
  ): CaisseFormRawValue | PartialWithRequiredKeyOf<NewCaisseFormRawValue> {
    return {
      ...caisse,
      dateCreationCaisse: caisse.dateCreationCaisse ? caisse.dateCreationCaisse.format(DATE_TIME_FORMAT) : undefined,
      dateFermiture: caisse.dateFermiture ? caisse.dateFermiture.format(DATE_TIME_FORMAT) : undefined,
      dateHeureModification: caisse.dateHeureModification ? caisse.dateHeureModification.format(DATE_TIME_FORMAT) : undefined,
      dateHeureCreation: caisse.dateHeureCreation ? caisse.dateHeureCreation.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
