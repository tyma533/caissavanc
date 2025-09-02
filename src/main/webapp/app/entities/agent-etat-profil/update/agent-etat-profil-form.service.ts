import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAgentEtatProfil, NewAgentEtatProfil } from '../agent-etat-profil.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAgentEtatProfil for edit and NewAgentEtatProfilFormGroupInput for create.
 */
type AgentEtatProfilFormGroupInput = IAgentEtatProfil | PartialWithRequiredKeyOf<NewAgentEtatProfil>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IAgentEtatProfil | NewAgentEtatProfil> = Omit<T, 'dateHeureModification' | 'dateHeureCreation'> & {
  dateHeureModification?: string | null;
  dateHeureCreation?: string | null;
};

type AgentEtatProfilFormRawValue = FormValueOf<IAgentEtatProfil>;

type NewAgentEtatProfilFormRawValue = FormValueOf<NewAgentEtatProfil>;

type AgentEtatProfilFormDefaults = Pick<NewAgentEtatProfil, 'id' | 'actif' | 'dateHeureModification' | 'dateHeureCreation'>;

type AgentEtatProfilFormGroupContent = {
  id: FormControl<AgentEtatProfilFormRawValue['id'] | NewAgentEtatProfil['id']>;
  profil: FormControl<AgentEtatProfilFormRawValue['profil']>;
  actif: FormControl<AgentEtatProfilFormRawValue['actif']>;
  dateHeureModification: FormControl<AgentEtatProfilFormRawValue['dateHeureModification']>;
  dateHeureCreation: FormControl<AgentEtatProfilFormRawValue['dateHeureCreation']>;
  modifiedBy: FormControl<AgentEtatProfilFormRawValue['modifiedBy']>;
  createdBy: FormControl<AgentEtatProfilFormRawValue['createdBy']>;
  agent: FormControl<AgentEtatProfilFormRawValue['agent']>;
  etablissement: FormControl<AgentEtatProfilFormRawValue['etablissement']>;
};

export type AgentEtatProfilFormGroup = FormGroup<AgentEtatProfilFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AgentEtatProfilFormService {
  createAgentEtatProfilFormGroup(agentEtatProfil: AgentEtatProfilFormGroupInput = { id: null }): AgentEtatProfilFormGroup {
    const agentEtatProfilRawValue = this.convertAgentEtatProfilToAgentEtatProfilRawValue({
      ...this.getFormDefaults(),
      ...agentEtatProfil,
    });
    return new FormGroup<AgentEtatProfilFormGroupContent>({
      id: new FormControl(
        { value: agentEtatProfilRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      profil: new FormControl(agentEtatProfilRawValue.profil),
      actif: new FormControl(agentEtatProfilRawValue.actif),
      dateHeureModification: new FormControl(agentEtatProfilRawValue.dateHeureModification),
      dateHeureCreation: new FormControl(agentEtatProfilRawValue.dateHeureCreation),
      modifiedBy: new FormControl(agentEtatProfilRawValue.modifiedBy),
      createdBy: new FormControl(agentEtatProfilRawValue.createdBy),
      agent: new FormControl(agentEtatProfilRawValue.agent),
      etablissement: new FormControl(agentEtatProfilRawValue.etablissement),
    });
  }

  getAgentEtatProfil(form: AgentEtatProfilFormGroup): IAgentEtatProfil | NewAgentEtatProfil {
    return this.convertAgentEtatProfilRawValueToAgentEtatProfil(
      form.getRawValue() as AgentEtatProfilFormRawValue | NewAgentEtatProfilFormRawValue,
    );
  }

  resetForm(form: AgentEtatProfilFormGroup, agentEtatProfil: AgentEtatProfilFormGroupInput): void {
    const agentEtatProfilRawValue = this.convertAgentEtatProfilToAgentEtatProfilRawValue({ ...this.getFormDefaults(), ...agentEtatProfil });
    form.reset(
      {
        ...agentEtatProfilRawValue,
        id: { value: agentEtatProfilRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AgentEtatProfilFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      actif: false,
      dateHeureModification: currentTime,
      dateHeureCreation: currentTime,
    };
  }

  private convertAgentEtatProfilRawValueToAgentEtatProfil(
    rawAgentEtatProfil: AgentEtatProfilFormRawValue | NewAgentEtatProfilFormRawValue,
  ): IAgentEtatProfil | NewAgentEtatProfil {
    return {
      ...rawAgentEtatProfil,
      dateHeureModification: dayjs(rawAgentEtatProfil.dateHeureModification, DATE_TIME_FORMAT),
      dateHeureCreation: dayjs(rawAgentEtatProfil.dateHeureCreation, DATE_TIME_FORMAT),
    };
  }

  private convertAgentEtatProfilToAgentEtatProfilRawValue(
    agentEtatProfil: IAgentEtatProfil | (Partial<NewAgentEtatProfil> & AgentEtatProfilFormDefaults),
  ): AgentEtatProfilFormRawValue | PartialWithRequiredKeyOf<NewAgentEtatProfilFormRawValue> {
    return {
      ...agentEtatProfil,
      dateHeureModification: agentEtatProfil.dateHeureModification
        ? agentEtatProfil.dateHeureModification.format(DATE_TIME_FORMAT)
        : undefined,
      dateHeureCreation: agentEtatProfil.dateHeureCreation ? agentEtatProfil.dateHeureCreation.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
