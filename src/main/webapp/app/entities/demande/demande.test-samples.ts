import dayjs from 'dayjs/esm';

import { IDemande, NewDemande } from './demande.model';

export const sampleWithRequiredData: IDemande = {
  id: 31299,
  objet: 'CLOTURE_CAISSE',
};

export const sampleWithPartialData: IDemande = {
  id: 23262,
  objet: 'REOUVERTURE_CAISSE',
  dateDemande: dayjs('2025-08-31T18:00'),
  motif: 'per',
};

export const sampleWithFullData: IDemande = {
  id: 27094,
  objet: 'REOUVERTURE_CAISSE',
  dateDemande: dayjs('2025-08-31T14:18'),
  motif: 'ha',
  dateHeureModification: dayjs('2025-09-01T09:39'),
  dateHeureCreation: dayjs('2025-08-31T10:26'),
  utiCree: 20150,
  utiModifie: 11447,
};

export const sampleWithNewData: NewDemande = {
  objet: 'REOUVERTURE_CAISSE',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
