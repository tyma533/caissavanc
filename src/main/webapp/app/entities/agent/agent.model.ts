import dayjs from 'dayjs/esm';

export interface IAgent {
  id: number;
  codeMatrile?: string | null;
  cni?: string | null;
  statutAgent?: string | null;
  nom?: string | null;
  prenom?: string | null;
  sexe?: string | null;
  emailUcad?: string | null;
  telephone?: string | null;
  fonctionAgent?: string | null;
  typePersonnel?: string | null;
  dateDeNaissance?: dayjs.Dayjs | null;
  lieuNaissance?: string | null;
  nationalite?: string | null;
  email?: string | null;
  adresse?: string | null;
  externe?: boolean | null;
  actif?: boolean | null;
  role?: string | null;
  dateHeureModification?: dayjs.Dayjs | null;
  dateHeureCreation?: dayjs.Dayjs | null;
  modifiedBy?: string | null;
  createdBy?: string | null;
}

export type NewAgent = Omit<IAgent, 'id'> & { id: null };
