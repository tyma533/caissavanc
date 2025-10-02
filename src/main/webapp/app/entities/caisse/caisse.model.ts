import dayjs from 'dayjs/esm';
import { IEtablissement } from 'app/entities/etablissement/etablissement.model';
import { EtatCaisse } from 'app/entities/enumerations/etat-caisse.model';

export interface ICaisse {
  id: number;
  libelle?: string | null;
  dateCreationCaisse?: dayjs.Dayjs | null;
  dateFermiture?: dayjs.Dayjs | null;
  solde?: number | null;
  etat?: keyof typeof EtatCaisse | null;
  dateHeureModification?: dayjs.Dayjs | null;
  dateHeureCreation?: dayjs.Dayjs | null;
  utiCree?: number | null;
  utiModifie?: number | null;
  etablissement?: Pick<IEtablissement, 'id' | 'libelle'> | null;
  gerantActif?: string | null;
}

export type NewCaisse = Omit<ICaisse, 'id'> & { id: null };
