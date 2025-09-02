import dayjs from 'dayjs/esm';

import { IEtatOperation, NewEtatOperation } from './etat-operation.model';

export const sampleWithRequiredData: IEtatOperation = {
  id: 11780,
};

export const sampleWithPartialData: IEtatOperation = {
  id: 18433,
  dateHeureCreation: dayjs('2025-08-31T21:25'),
  utiCree: 30756,
};

export const sampleWithFullData: IEtatOperation = {
  id: 28120,
  libelle: 'plus',
  dateHeureModification: dayjs('2025-09-01T02:53'),
  dateHeureCreation: dayjs('2025-09-01T06:05'),
  utiCree: 14104,
  utiModifie: 19223,
};

export const sampleWithNewData: NewEtatOperation = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
