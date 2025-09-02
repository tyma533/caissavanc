import dayjs from 'dayjs/esm';

import { IModeOperation, NewModeOperation } from './mode-operation.model';

export const sampleWithRequiredData: IModeOperation = {
  id: 8818,
};

export const sampleWithPartialData: IModeOperation = {
  id: 11797,
  libelle: 'phew till beating',
  dateHeureModification: dayjs('2025-09-01T06:22'),
  dateHeureCreation: dayjs('2025-08-31T14:01'),
  utiModifie: 31899,
};

export const sampleWithFullData: IModeOperation = {
  id: 19117,
  libelle: 'out',
  dateHeureModification: dayjs('2025-08-31T12:06'),
  dateHeureCreation: dayjs('2025-09-01T03:50'),
  utiCree: 6695,
  utiModifie: 31230,
};

export const sampleWithNewData: NewModeOperation = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
