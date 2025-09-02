import dayjs from 'dayjs/esm';
import { ICaisse } from 'app/entities/caisse/caisse.model';
import { IRubrique } from 'app/entities/rubrique/rubrique.model';

export interface ICaisseRubrique {
  id: number;
  dateHeureModification?: dayjs.Dayjs | null;
  dateHeureCreation?: dayjs.Dayjs | null;
  utiCree?: number | null;
  utiModifie?: number | null;
  caisse?: Pick<ICaisse, 'id'> | null;
  rubrique?: Pick<IRubrique, 'id'> | null;
}

export type NewCaisseRubrique = Omit<ICaisseRubrique, 'id'> & { id: null };
