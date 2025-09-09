import dayjs from 'dayjs/esm';

export interface IRubrique {
  selected?: boolean;
  id: number;
  libelle?: string | null;
  description?: string | null;
  code?: string | null;
  dateHeureModification?: dayjs.Dayjs | null;
  dateHeureCreation?: dayjs.Dayjs | null;
  utiCree?: number | null;
  utiModifie?: number | null;
}

export type NewRubrique = Omit<IRubrique, 'id'> & { id: null };
