import dayjs from 'dayjs/esm';
import { IEtablissement } from 'app/entities/etablissement/etablissement.model';
import { Objet } from 'app/entities/enumerations/objet.model';

export interface IDemande {
  id: number;
  objet?: keyof typeof Objet | null;
  dateDemande?: dayjs.Dayjs | null;
  motif?: string | null;
  dateHeureModification?: dayjs.Dayjs | null;
  dateHeureCreation?: dayjs.Dayjs | null;
  utiCree?: number | null;
  utiModifie?: number | null;
  etablissement?: Pick<IEtablissement, 'id'> | null;
  libelle?: string | null;
  montant?: number | null;
}

export type NewDemande = Omit<IDemande, 'id'> & { id: null };
