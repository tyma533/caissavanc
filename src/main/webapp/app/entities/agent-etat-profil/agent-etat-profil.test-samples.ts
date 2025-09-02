import dayjs from 'dayjs/esm';

import { IAgentEtatProfil, NewAgentEtatProfil } from './agent-etat-profil.model';

export const sampleWithRequiredData: IAgentEtatProfil = {
  id: 20427,
};

export const sampleWithPartialData: IAgentEtatProfil = {
  id: 31646,
  actif: true,
  dateHeureModification: dayjs('2025-09-01T05:18'),
};

export const sampleWithFullData: IAgentEtatProfil = {
  id: 17567,
  profil: 'line even',
  actif: true,
  dateHeureModification: dayjs('2025-08-31T21:21'),
  dateHeureCreation: dayjs('2025-09-01T08:30'),
  modifiedBy: 'who blindly sculpture',
  createdBy: 'and',
};

export const sampleWithNewData: NewAgentEtatProfil = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
