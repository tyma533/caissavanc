export enum Type {
  CREATION_CAISSE = 'CREATION_CAISSE',

  ALIMENTATION_CAISSE = 'ALIMENTATION_CAISSE',

  CLOTURE_CAISSE = 'CLOTURE_CAISSE',

  REOUVERTURE_CAISSE = 'REOUVERTURE_CAISSE',
}

export const EnumTypeLabels = {
  [Type.CREATION_CAISSE]: 'Création de Caisse',
  [Type.ALIMENTATION_CAISSE]: 'Alimentation de Caisse',
  [Type.CLOTURE_CAISSE]: 'Cloture de Caisse',
  [Type.REOUVERTURE_CAISSE]: 'Réouverture de Caisse',
};
