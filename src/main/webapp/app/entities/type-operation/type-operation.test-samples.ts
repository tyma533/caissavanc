import dayjs from 'dayjs/esm';

import { ITypeOperation, NewTypeOperation } from './type-operation.model';

export const sampleWithRequiredData: ITypeOperation = {
  id: 2110,
};

export const sampleWithPartialData: ITypeOperation = {
  id: 716,
  libelle: 'penalize given pish',
  utiCree: 29704,
  utiModifie: 9532,
};

export const sampleWithFullData: ITypeOperation = {
  id: 11180,
  libelle: 'hurtful',
  dateHeureModification: dayjs('2025-08-31T21:10'),
  dateHeureCreation: dayjs('2025-08-31T18:55'),
  utiCree: 4524,
  utiModifie: 4380,
};

export const sampleWithNewData: NewTypeOperation = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
