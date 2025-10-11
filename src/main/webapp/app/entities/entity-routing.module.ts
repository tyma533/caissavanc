import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import SharedModule from 'app/shared/shared.module';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'caisse',
        data: { pageTitle: 'caissavance2App.caisse.home.title' },
        loadChildren: () => import('./caisse/caisse.routes'),
      },
      {
        path: 'etablissement',
        data: { pageTitle: 'caissavance2App.etablissement.home.title' },
        loadChildren: () => import('./etablissement/etablissement.routes'),
      },
      {
        path: 'demande',
        data: { pageTitle: 'caissavance2App.demande.home.title' },
        loadChildren: () => import('./demande/demande.routes'),
      },
      {
        path: 'operation',
        data: { pageTitle: 'caissavance2App.operation.home.title' },
        loadChildren: () => import('./operation/operation.routes'),
      },
      {
        path: 'type-operation',
        data: { pageTitle: 'caissavance2App.typeOperation.home.title' },
        loadChildren: () => import('./type-operation/type-operation.routes'),
      },
      {
        path: 'mode-operation',
        data: { pageTitle: 'caissavance2App.modeOperation.home.title' },
        loadChildren: () => import('./mode-operation/mode-operation.routes'),
      },
      {
        path: 'etat-operation',
        data: { pageTitle: 'caissavance2App.etatOperation.home.title' },
        loadChildren: () => import('./etat-operation/etat-operation.routes'),
      },
      {
        path: 'piece-justificatif',
        data: { pageTitle: 'caissavance2App.pieceJustificatif.home.title' },
        loadChildren: () => import('./piece-justificatif/piece-justificatif.routes'),
      },
      {
        path: 'rubrique',
        data: { pageTitle: 'caissavance2App.rubrique.home.title' },
        loadChildren: () => import('./rubrique/rubrique.routes'),
      },
      {
        path: 'gerant',
        data: { pageTitle: 'caissavance2App.gerant.home.title' },
        loadChildren: () => import('./gerant/gerant.routes'),
      },
      {
        path: 'gerant-caisse',
        data: { pageTitle: 'caissavance2App.gerantCaisse.home.title' },
        loadChildren: () => import('./gerant-caisse/gerant-caisse.routes'),
      },
      {
        path: 'caisse-rubrique',
        data: { pageTitle: 'caissavance2App.caisseRubrique.home.title' },
        loadChildren: () => import('./caisse-rubrique/caisse-rubrique.routes'),
      },
      {
        path: 'controle',
        data: { pageTitle: 'caissavance2App.controle.home.title' },
        loadChildren: () => import('./controle/controle.routes'),
      },
      {
        path: 'agent',
        data: { pageTitle: 'caissavance2App.agent.home.title' },
        loadChildren: () => import('./agent/agent.routes'),
      },
      {
        path: 'agent-etat-profil',
        data: { pageTitle: 'caissavance2App.agentEtatProfil.home.title' },
        loadChildren: () => import('./agent-etat-profil/agent-etat-profil.routes'),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
