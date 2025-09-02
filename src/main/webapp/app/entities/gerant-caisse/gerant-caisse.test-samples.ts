import dayjs from 'dayjs/esm';

import { IGerantCaisse, NewGerantCaisse } from './gerant-caisse.model';

export const sampleWithRequiredData: IGerantCaisse = {
  id: 26068,
};

export const sampleWithPartialData: IGerantCaisse = {
  id: 2707,
  utiModifie: 17640,
};

export const sampleWithFullData: IGerantCaisse = {
  id: 373,
  actif: true,
  dateHeureModification: dayjs('2025-09-01T04:40'),
  dateHeureCreation: dayjs('2025-09-01T09:05'),
  utiCree: 27891,
  utiModifie: 30842,
};

export const sampleWithNewData: NewGerantCaisse = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
