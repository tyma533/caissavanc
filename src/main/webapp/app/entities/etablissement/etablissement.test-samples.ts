import dayjs from 'dayjs/esm';

import { IEtablissement, NewEtablissement } from './etablissement.model';

export const sampleWithRequiredData: IEtablissement = {
  id: 11223,
  libelle: 'midst furthermore',
  sigle: 'gratefully yahoo phooey',
};

export const sampleWithPartialData: IEtablissement = {
  id: 16912,
  libelle: 'jackfruit',
  sigle: 'or',
  dateHeureModification: dayjs('2025-08-31T20:00'),
  dateHeureCreation: dayjs('2025-08-31T18:30'),
  utiCree: 12117,
  utiModifie: 5334,
};

export const sampleWithFullData: IEtablissement = {
  id: 30816,
  libelle: 'interestingly including',
  sigle: 'annually',
  dateHeureModification: dayjs('2025-09-01T00:53'),
  dateHeureCreation: dayjs('2025-08-31T21:40'),
  utiCree: 20300,
  utiModifie: 7283,
};

export const sampleWithNewData: NewEtablissement = {
  libelle: 'once archaeology upon',
  sigle: 'bah',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
