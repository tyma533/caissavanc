export enum EtatDemande {
  EN_ATTENTE = 'EN_ATTENTE',

  VALIDEE_DFC = 'VALIDEE_DFC',

  REFUSEE_DFC = 'REFUSEE_DFC',

  EXECUTEE = 'EXECUTEE',
}

export const EnumEtatDemandeLabels = {
  [EtatDemande.EN_ATTENTE]: 'En attente',
  [EtatDemande.VALIDEE_DFC]: 'Validée',
  [EtatDemande.REFUSEE_DFC]: 'Refusée',
  [EtatDemande.EXECUTEE]: 'Exécutée',
};
