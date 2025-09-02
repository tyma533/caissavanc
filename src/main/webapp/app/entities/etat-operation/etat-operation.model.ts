import dayjs from 'dayjs/esm';

export interface IEtatOperation {
  id: number;
  libelle?: string | null;
  dateHeureModification?: dayjs.Dayjs | null;
  dateHeureCreation?: dayjs.Dayjs | null;
  utiCree?: number | null;
  utiModifie?: number | null;
}

export type NewEtatOperation = Omit<IEtatOperation, 'id'> & { id: null };
