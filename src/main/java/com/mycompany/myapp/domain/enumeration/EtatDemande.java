package com.mycompany.myapp.domain.enumeration;

public enum EtatDemande {
    EN_ATTENTE, // Demande créée et en attente de validation DFC
    VALIDEE_DFC, // DFC a validé et renseigné le montantAccorde
    REFUSEE_DFC, // DFC a refusé
    EXECUTEE,
}
