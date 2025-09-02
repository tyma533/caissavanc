import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAgent, NewAgent } from '../agent.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAgent for edit and NewAgentFormGroupInput for create.
 */
type AgentFormGroupInput = IAgent | PartialWithRequiredKeyOf<NewAgent>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IAgent | NewAgent> = Omit<T, 'dateHeureModification' | 'dateHeureCreation'> & {
  dateHeureModification?: string | null;
  dateHeureCreation?: string | null;
};

type AgentFormRawValue = FormValueOf<IAgent>;

type NewAgentFormRawValue = FormValueOf<NewAgent>;

type AgentFormDefaults = Pick<NewAgent, 'id' | 'externe' | 'actif' | 'dateHeureModification' | 'dateHeureCreation'>;

type AgentFormGroupContent = {
  id: FormControl<AgentFormRawValue['id'] | NewAgent['id']>;
  codeMatrile: FormControl<AgentFormRawValue['codeMatrile']>;
  cni: FormControl<AgentFormRawValue['cni']>;
  statutAgent: FormControl<AgentFormRawValue['statutAgent']>;
  nom: FormControl<AgentFormRawValue['nom']>;
  prenom: FormControl<AgentFormRawValue['prenom']>;
  sexe: FormControl<AgentFormRawValue['sexe']>;
  emailUcad: FormControl<AgentFormRawValue['emailUcad']>;
  telephone: FormControl<AgentFormRawValue['telephone']>;
  fonctionAgent: FormControl<AgentFormRawValue['fonctionAgent']>;
  typePersonnel: FormControl<AgentFormRawValue['typePersonnel']>;
  dateDeNaissance: FormControl<AgentFormRawValue['dateDeNaissance']>;
  lieuNaissance: FormControl<AgentFormRawValue['lieuNaissance']>;
  nationalite: FormControl<AgentFormRawValue['nationalite']>;
  email: FormControl<AgentFormRawValue['email']>;
  adresse: FormControl<AgentFormRawValue['adresse']>;
  externe: FormControl<AgentFormRawValue['externe']>;
  actif: FormControl<AgentFormRawValue['actif']>;
  role: FormControl<AgentFormRawValue['role']>;
  dateHeureModification: FormControl<AgentFormRawValue['dateHeureModification']>;
  dateHeureCreation: FormControl<AgentFormRawValue['dateHeureCreation']>;
  modifiedBy: FormControl<AgentFormRawValue['modifiedBy']>;
  createdBy: FormControl<AgentFormRawValue['createdBy']>;
};

export type AgentFormGroup = FormGroup<AgentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AgentFormService {
  createAgentFormGroup(agent: AgentFormGroupInput = { id: null }): AgentFormGroup {
    const agentRawValue = this.convertAgentToAgentRawValue({
      ...this.getFormDefaults(),
      ...agent,
    });
    return new FormGroup<AgentFormGroupContent>({
      id: new FormControl(
        { value: agentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      codeMatrile: new FormControl(agentRawValue.codeMatrile, {
        validators: [Validators.required],
      }),
      cni: new FormControl(agentRawValue.cni, {
        validators: [Validators.required, Validators.maxLength(20)],
      }),
      statutAgent: new FormControl(agentRawValue.statutAgent),
      nom: new FormControl(agentRawValue.nom),
      prenom: new FormControl(agentRawValue.prenom),
      sexe: new FormControl(agentRawValue.sexe),
      emailUcad: new FormControl(agentRawValue.emailUcad, {
        validators: [Validators.required],
      }),
      telephone: new FormControl(agentRawValue.telephone),
      fonctionAgent: new FormControl(agentRawValue.fonctionAgent),
      typePersonnel: new FormControl(agentRawValue.typePersonnel),
      dateDeNaissance: new FormControl(agentRawValue.dateDeNaissance),
      lieuNaissance: new FormControl(agentRawValue.lieuNaissance),
      nationalite: new FormControl(agentRawValue.nationalite),
      email: new FormControl(agentRawValue.email),
      adresse: new FormControl(agentRawValue.adresse),
      externe: new FormControl(agentRawValue.externe),
      actif: new FormControl(agentRawValue.actif),
      role: new FormControl(agentRawValue.role),
      dateHeureModification: new FormControl(agentRawValue.dateHeureModification),
      dateHeureCreation: new FormControl(agentRawValue.dateHeureCreation),
      modifiedBy: new FormControl(agentRawValue.modifiedBy),
      createdBy: new FormControl(agentRawValue.createdBy),
    });
  }

  getAgent(form: AgentFormGroup): IAgent | NewAgent {
    return this.convertAgentRawValueToAgent(form.getRawValue() as AgentFormRawValue | NewAgentFormRawValue);
  }

  resetForm(form: AgentFormGroup, agent: AgentFormGroupInput): void {
    const agentRawValue = this.convertAgentToAgentRawValue({ ...this.getFormDefaults(), ...agent });
    form.reset(
      {
        ...agentRawValue,
        id: { value: agentRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AgentFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      externe: false,
      actif: false,
      dateHeureModification: currentTime,
      dateHeureCreation: currentTime,
    };
  }

  private convertAgentRawValueToAgent(rawAgent: AgentFormRawValue | NewAgentFormRawValue): IAgent | NewAgent {
    return {
      ...rawAgent,
      dateHeureModification: dayjs(rawAgent.dateHeureModification, DATE_TIME_FORMAT),
      dateHeureCreation: dayjs(rawAgent.dateHeureCreation, DATE_TIME_FORMAT),
    };
  }

  private convertAgentToAgentRawValue(
    agent: IAgent | (Partial<NewAgent> & AgentFormDefaults),
  ): AgentFormRawValue | PartialWithRequiredKeyOf<NewAgentFormRawValue> {
    return {
      ...agent,
      dateHeureModification: agent.dateHeureModification ? agent.dateHeureModification.format(DATE_TIME_FORMAT) : undefined,
      dateHeureCreation: agent.dateHeureCreation ? agent.dateHeureCreation.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
