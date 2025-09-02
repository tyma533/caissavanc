import dayjs from 'dayjs/esm';

import { ICaisse, NewCaisse } from './caisse.model';

export const sampleWithRequiredData: ICaisse = {
  id: 16401,
  libelle: 'about displease',
  solde: 17066,
  etat: 'EN_CONTROLE',
};

export const sampleWithPartialData: ICaisse = {
  id: 30922,
  libelle: 'mmm',
  dateFermiture: dayjs('2025-08-31T20:33'),
  solde: 25242,
  etat: 'EN_CONTROLE',
  utiModifie: 11799,
};

export const sampleWithFullData: ICaisse = {
  id: 8842,
  libelle: 'aha than muddy',
  dateCreationCaisse: dayjs('2025-09-01T00:44'),
  dateFermiture: dayjs('2025-08-31T18:43'),
  solde: 22066,
  etat: 'OUVERTE',
  dateHeureModification: dayjs('2025-09-01T01:57'),
  dateHeureCreation: dayjs('2025-08-31T10:19'),
  utiCree: 511,
  utiModifie: 15311,
};

export const sampleWithNewData: NewCaisse = {
  libelle: 'evenly eventually',
  solde: 12392,
  etat: 'CLOTURE',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
