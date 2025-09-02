import dayjs from 'dayjs/esm';
import { IAgentEtatProfil } from 'app/entities/agent-etat-profil/agent-etat-profil.model';

export interface IGerant {
  id: number;
  nom?: string | null;
  dateNomination?: dayjs.Dayjs | null;
  dateFin?: dayjs.Dayjs | null;
  dateHeureModification?: dayjs.Dayjs | null;
  dateHeureCreation?: dayjs.Dayjs | null;
  utiCree?: number | null;
  utiModifie?: number | null;
  agentEtatProfil?: Pick<IAgentEtatProfil, 'id'> | null;
}

export type NewGerant = Omit<IGerant, 'id'> & { id: null };
