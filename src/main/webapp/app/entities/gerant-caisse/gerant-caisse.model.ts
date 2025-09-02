import dayjs from 'dayjs/esm';
import { ICaisse } from 'app/entities/caisse/caisse.model';
import { IGerant } from 'app/entities/gerant/gerant.model';

export interface IGerantCaisse {
  id: number;
  actif?: boolean | null;
  dateHeureModification?: dayjs.Dayjs | null;
  dateHeureCreation?: dayjs.Dayjs | null;
  utiCree?: number | null;
  utiModifie?: number | null;
  caisse?: Pick<ICaisse, 'id'> | null;
  gerant?: Pick<IGerant, 'id'> | null;
}

export type NewGerantCaisse = Omit<IGerantCaisse, 'id'> & { id: null };
