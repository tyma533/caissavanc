import dayjs from 'dayjs/esm';
import { IEtablissement } from 'app/entities/etablissement/etablissement.model';
import { Type } from 'app/entities/enumerations/type.model';
import { IModeOperation } from '../mode-operation/mode-operation.model';

export interface IDemande {
  id: number;
  type?: keyof typeof Type | null;
  dateDemande?: dayjs.Dayjs | null;
  motif?: string | null;
  dateHeureModification?: dayjs.Dayjs | null;
  dateHeureCreation?: dayjs.Dayjs | null;
  utiCree?: number | null;
  utiModifie?: number | null;
  etablissement?: Pick<IEtablissement, 'id' | 'libelle'> | null;
  intitule?: string | null;
  montant?: number | null;
  caisseId?: number | null;
  modeOperationId?: IModeOperation | null;
  objet?: string | null;
  etat?: 'EN_ATTENTE' | 'TRAITEE';
}

export type NewDemande = Omit<IDemande, 'id'> & { id: null };
