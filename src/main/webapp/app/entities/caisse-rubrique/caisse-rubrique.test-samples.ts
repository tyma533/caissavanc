import dayjs from 'dayjs/esm';

import { ICaisseRubrique, NewCaisseRubrique } from './caisse-rubrique.model';

export const sampleWithRequiredData: ICaisseRubrique = {
  id: 9721,
};

export const sampleWithPartialData: ICaisseRubrique = {
  id: 18254,
  dateHeureCreation: dayjs('2025-09-01T01:06'),
  utiCree: 15117,
};

export const sampleWithFullData: ICaisseRubrique = {
  id: 20860,
  dateHeureModification: dayjs('2025-08-31T10:46'),
  dateHeureCreation: dayjs('2025-08-31T20:29'),
  utiCree: 3953,
  utiModifie: 4162,
};

export const sampleWithNewData: NewCaisseRubrique = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
