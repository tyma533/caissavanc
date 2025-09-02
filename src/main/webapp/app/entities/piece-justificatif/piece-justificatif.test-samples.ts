import dayjs from 'dayjs/esm';

import { IPieceJustificatif, NewPieceJustificatif } from './piece-justificatif.model';

export const sampleWithRequiredData: IPieceJustificatif = {
  id: 2735,
};

export const sampleWithPartialData: IPieceJustificatif = {
  id: 18191,
  dateHeureModification: dayjs('2025-08-31T19:19'),
  utiCree: 31508,
  utiModifie: 17569,
};

export const sampleWithFullData: IPieceJustificatif = {
  id: 20650,
  libelle: 'how',
  piece: '../fake-data/blob/hipster.png',
  pieceContentType: 'unknown',
  dateHeureModification: dayjs('2025-08-31T13:04'),
  dateHeureCreation: dayjs('2025-08-31T18:13'),
  utiCree: 19578,
  utiModifie: 26038,
};

export const sampleWithNewData: NewPieceJustificatif = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
