import dayjs from 'dayjs/esm';

import { IRubrique, NewRubrique } from './rubrique.model';

export const sampleWithRequiredData: IRubrique = {
  id: 27387,
};

export const sampleWithPartialData: IRubrique = {
  id: 22337,
  libelle: 'palatable speech',
  dateHeureModification: dayjs('2025-09-01T01:46'),
  dateHeureCreation: dayjs('2025-08-31T18:21'),
  utiModifie: 4237,
};

export const sampleWithFullData: IRubrique = {
  id: 24067,
  libelle: 'handball',
  description: 'via impassioned',
  code: 'inspector alongside',
  dateHeureModification: dayjs('2025-09-01T02:41'),
  dateHeureCreation: dayjs('2025-08-31T23:58'),
  utiCree: 16295,
  utiModifie: 4568,
};

export const sampleWithNewData: NewRubrique = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
