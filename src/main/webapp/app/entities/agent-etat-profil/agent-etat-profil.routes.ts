import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { AgentEtatProfilComponent } from './list/agent-etat-profil.component';
import { AgentEtatProfilDetailComponent } from './detail/agent-etat-profil-detail.component';
import { AgentEtatProfilUpdateComponent } from './update/agent-etat-profil-update.component';
import AgentEtatProfilResolve from './route/agent-etat-profil-routing-resolve.service';

const agentEtatProfilRoute: Routes = [
  {
    path: '',
    component: AgentEtatProfilComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AgentEtatProfilDetailComponent,
    resolve: {
      agentEtatProfil: AgentEtatProfilResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AgentEtatProfilUpdateComponent,
    resolve: {
      agentEtatProfil: AgentEtatProfilResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AgentEtatProfilUpdateComponent,
    resolve: {
      agentEtatProfil: AgentEtatProfilResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default agentEtatProfilRoute;
