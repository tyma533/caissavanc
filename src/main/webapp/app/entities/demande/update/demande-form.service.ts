import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IDemande, NewDemande } from '../demande.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDemande for edit and NewDemandeFormGroupInput for create.
 */
type DemandeFormGroupInput = IDemande | PartialWithRequiredKeyOf<NewDemande>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IDemande | NewDemande> = Omit<T, 'dateDemande' | 'dateHeureModification' | 'dateHeureCreation'> & {
  dateDemande?: string | null;
  dateHeureModification?: string | null;
  dateHeureCreation?: string | null;
};

type DemandeFormRawValue = FormValueOf<IDemande>;
type NewDemandeFormRawValue = FormValueOf<NewDemande>;

type DemandeFormDefaults = Pick<NewDemande, 'id' | 'dateDemande' | 'dateHeureModification' | 'dateHeureCreation'>;

type DemandeFormGroupContent = {
  id: FormControl<DemandeFormRawValue['id'] | NewDemande['id']>;
  type: FormControl<DemandeFormRawValue['type']>;
  dateDemande: FormControl<DemandeFormRawValue['dateDemande']>;
  motif: FormControl<DemandeFormRawValue['motif']>;
  dateHeureModification: FormControl<DemandeFormRawValue['dateHeureModification']>;
  dateHeureCreation: FormControl<DemandeFormRawValue['dateHeureCreation']>;
  utiCree: FormControl<DemandeFormRawValue['utiCree']>;
  utiModifie: FormControl<DemandeFormRawValue['utiModifie']>;
  etablissement: FormControl<DemandeFormRawValue['etablissement']>;
  intitule: FormControl<DemandeFormRawValue['intitule']>;
  montant: FormControl<DemandeFormRawValue['montant']>;
  caisseId: FormControl<number | null>;
  objet: FormControl<DemandeFormRawValue['objet'] | null>;
};

export type DemandeFormGroup = FormGroup<DemandeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DemandeFormService {
  createDemandeFormGroup(demande: DemandeFormGroupInput = { id: null }): DemandeFormGroup {
    const demandeRawValue = this.convertDemandeToDemandeRawValue({
      ...this.getFormDefaults(),
      ...demande,
    });

    return new FormGroup<DemandeFormGroupContent>({
      id: new FormControl({ value: demandeRawValue.id, disabled: true }, { nonNullable: true, validators: [Validators.required] }),
      type: new FormControl(demandeRawValue.type, { validators: [Validators.required] }),
      dateDemande: new FormControl(demandeRawValue.dateDemande),
      motif: new FormControl(demandeRawValue.motif),
      dateHeureModification: new FormControl(demandeRawValue.dateHeureModification),
      dateHeureCreation: new FormControl(demandeRawValue.dateHeureCreation),
      utiCree: new FormControl(demandeRawValue.utiCree),
      utiModifie: new FormControl(demandeRawValue.utiModifie),
      etablissement: new FormControl(demandeRawValue.etablissement),
      intitule: new FormControl(demandeRawValue.intitule),
      montant: new FormControl(demandeRawValue.montant),
      caisseId: new FormControl(demandeRawValue.caisseId ?? null),
      objet: new FormControl(demandeRawValue.objet ?? null),
    });
  }

  getDemande(form: DemandeFormGroup): IDemande | NewDemande {
    return this.convertDemandeRawValueToDemande(form.getRawValue() as DemandeFormRawValue | NewDemandeFormRawValue);
  }

  resetForm(form: DemandeFormGroup, demande: DemandeFormGroupInput): void {
    const demandeRawValue = this.convertDemandeToDemandeRawValue({ ...this.getFormDefaults(), ...demande });
    form.reset(
      {
        ...demandeRawValue,
        id: { value: demandeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): DemandeFormDefaults {
    const currentTime = dayjs();
    return {
      id: null,
      dateDemande: currentTime,
      dateHeureModification: currentTime,
      dateHeureCreation: currentTime,
    };
  }

  private convertDemandeRawValueToDemande(rawDemande: DemandeFormRawValue | NewDemandeFormRawValue): IDemande | NewDemande {
    return {
      ...rawDemande,
      dateDemande: dayjs(rawDemande.dateDemande, DATE_TIME_FORMAT),
      dateHeureModification: dayjs(rawDemande.dateHeureModification, DATE_TIME_FORMAT),
      dateHeureCreation: dayjs(rawDemande.dateHeureCreation, DATE_TIME_FORMAT),
    };
  }

  private convertDemandeToDemandeRawValue(
    demande: IDemande | (Partial<NewDemande> & DemandeFormDefaults),
  ): DemandeFormRawValue | PartialWithRequiredKeyOf<NewDemandeFormRawValue> {
    return {
      ...demande,
      dateDemande: demande.dateDemande ? demande.dateDemande.format(DATE_TIME_FORMAT) : undefined,
      dateHeureModification: demande.dateHeureModification ? demande.dateHeureModification.format(DATE_TIME_FORMAT) : undefined,
      dateHeureCreation: demande.dateHeureCreation ? demande.dateHeureCreation.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
