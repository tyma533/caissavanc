import dayjs from 'dayjs/esm';

import { IOperation, NewOperation } from './operation.model';

export const sampleWithRequiredData: IOperation = {
  id: 20983,
  numero: 'worn showboat nutrient',
  commentaire: 'snarling aw',
  montant: 2343,
};

export const sampleWithPartialData: IOperation = {
  id: 21965,
  numero: 'salami',
  commentaire: 'shiny qua assign',
  montant: 6657,
  dateHeureCreation: dayjs('2025-09-01T00:21'),
};

export const sampleWithFullData: IOperation = {
  id: 26267,
  numero: 'gah',
  commentaire: 'likewise muddle',
  montant: 30055,
  dateOperation: dayjs('2025-09-01T09:50'),
  dateHeureModification: dayjs('2025-08-31T21:52'),
  dateHeureCreation: dayjs('2025-09-01T06:06'),
  utiCree: 4230,
  utiModifie: 17873,
};

export const sampleWithNewData: NewOperation = {
  numero: 'sweetly reproduce corduroy',
  commentaire: 'geez across optimal',
  montant: 9132,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
