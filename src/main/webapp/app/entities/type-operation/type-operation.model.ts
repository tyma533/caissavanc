import dayjs from 'dayjs/esm';

export interface ITypeOperation {
  id: number;
  libelle?: string | null;
  dateHeureModification?: dayjs.Dayjs | null;
  dateHeureCreation?: dayjs.Dayjs | null;
  utiCree?: number | null;
  utiModifie?: number | null;
}

export type NewTypeOperation = Omit<ITypeOperation, 'id'> & { id: null };
