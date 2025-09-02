import dayjs from 'dayjs/esm';

import { IAgent, NewAgent } from './agent.model';

export const sampleWithRequiredData: IAgent = {
  id: 24899,
  codeMatrile: 'deconstruct excepting',
  cni: 'regarding golden apr',
  emailUcad: 'woot',
};

export const sampleWithPartialData: IAgent = {
  id: 10427,
  codeMatrile: 'that unlike instantly',
  cni: 'fooey under fooey',
  emailUcad: 'reset',
  telephone: '(880) 710-7309',
  typePersonnel: 'midst ew',
  dateDeNaissance: dayjs('2025-09-01'),
  externe: true,
  dateHeureModification: dayjs('2025-08-31T12:20'),
  dateHeureCreation: dayjs('2025-09-01T07:38'),
};

export const sampleWithFullData: IAgent = {
  id: 19945,
  codeMatrile: 'sympathetically',
  cni: 'normalize',
  statutAgent: 'meanwhile curvy',
  nom: 'disparity',
  prenom: 'if filter',
  sexe: 'enormously wall',
  emailUcad: 'whoever through disparage',
  telephone: '1-558-241-8317 x5331',
  fonctionAgent: 'old',
  typePersonnel: 'as roof cynic',
  dateDeNaissance: dayjs('2025-08-31'),
  lieuNaissance: 'glistening',
  nationalite: 'wholesaler',
  email: 'Hassie45@gmail.com',
  adresse: 'investigate',
  externe: true,
  actif: true,
  role: 'digest',
  dateHeureModification: dayjs('2025-08-31T23:48'),
  dateHeureCreation: dayjs('2025-09-01T07:52'),
  modifiedBy: 'gah',
  createdBy: 'realign whereas phew',
};

export const sampleWithNewData: NewAgent = {
  codeMatrile: 'midst relent',
  cni: 'colorless',
  emailUcad: 'supposing',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
