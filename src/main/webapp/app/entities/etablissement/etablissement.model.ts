import dayjs from 'dayjs/esm';

export interface IEtablissement {
  id: number;
  libelle?: string | null;
  sigle?: string | null;
  dateHeureModification?: dayjs.Dayjs | null;
  dateHeureCreation?: dayjs.Dayjs | null;
  utiCree?: number | null;
  utiModifie?: number | null;
}

export type NewEtablissement = Omit<IEtablissement, 'id'> & { id: null };
