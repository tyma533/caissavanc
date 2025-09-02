import dayjs from 'dayjs/esm';
import { ICaisse } from 'app/entities/caisse/caisse.model';

export interface IControle {
  id: number;
  dateControle?: dayjs.Dayjs | null;
  observation?: string | null;
  dateHeureModification?: dayjs.Dayjs | null;
  dateHeureCreation?: dayjs.Dayjs | null;
  utiCree?: number | null;
  utiModifie?: number | null;
  caisse?: Pick<ICaisse, 'id'> | null;
}

export type NewControle = Omit<IControle, 'id'> & { id: null };
