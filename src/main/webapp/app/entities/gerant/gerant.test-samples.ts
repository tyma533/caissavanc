import dayjs from 'dayjs/esm';

import { IGerant, NewGerant } from './gerant.model';

export const sampleWithRequiredData: IGerant = {
  id: 7314,
};

export const sampleWithPartialData: IGerant = {
  id: 17529,
  dateFin: dayjs('2025-09-01T09:34'),
  dateHeureModification: dayjs('2025-08-31T19:25'),
};

export const sampleWithFullData: IGerant = {
  id: 19985,
  nom: 'svelte',
  dateNomination: dayjs('2025-08-31T16:19'),
  dateFin: dayjs('2025-09-01T08:16'),
  dateHeureModification: dayjs('2025-09-01T00:18'),
  dateHeureCreation: dayjs('2025-08-31T22:44'),
  utiCree: 1540,
  utiModifie: 13167,
};

export const sampleWithNewData: NewGerant = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
