import dayjs from 'dayjs/esm';

export interface IModeOperation {
  id: number;
  libelle?: string | null;
  dateHeureModification?: dayjs.Dayjs | null;
  dateHeureCreation?: dayjs.Dayjs | null;
  utiCree?: number | null;
  utiModifie?: number | null;
}

export type NewModeOperation = Omit<IModeOperation, 'id'> & { id: null };
