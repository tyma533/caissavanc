import dayjs from 'dayjs/esm';
import { IAgent } from 'app/entities/agent/agent.model';
import { IEtablissement } from 'app/entities/etablissement/etablissement.model';

export interface IAgentEtatProfil {
  id: number;
  profil?: string | null;
  actif?: boolean | null;
  dateHeureModification?: dayjs.Dayjs | null;
  dateHeureCreation?: dayjs.Dayjs | null;
  modifiedBy?: string | null;
  createdBy?: string | null;
  agent?: Pick<IAgent, 'id'> | null;
  etablissement?: Pick<IEtablissement, 'id'> | null;
}

export type NewAgentEtatProfil = Omit<IAgentEtatProfil, 'id'> & { id: null };
