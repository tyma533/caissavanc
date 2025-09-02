import dayjs from 'dayjs/esm';

import { IControle, NewControle } from './controle.model';

export const sampleWithRequiredData: IControle = {
  id: 1631,
};

export const sampleWithPartialData: IControle = {
  id: 1550,
  dateControle: dayjs('2025-09-01T04:00'),
  observation: 'caring',
  dateHeureModification: dayjs('2025-08-31T15:27'),
  dateHeureCreation: dayjs('2025-09-01T08:35'),
  utiModifie: 9748,
};

export const sampleWithFullData: IControle = {
  id: 27763,
  dateControle: dayjs('2025-09-01T02:58'),
  observation: 'ick well',
  dateHeureModification: dayjs('2025-08-31T22:11'),
  dateHeureCreation: dayjs('2025-08-31T14:05'),
  utiCree: 12665,
  utiModifie: 15053,
};

export const sampleWithNewData: NewControle = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
