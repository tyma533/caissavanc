import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { GerantCaisseComponent } from './list/gerant-caisse.component';
import { GerantCaisseDetailComponent } from './detail/gerant-caisse-detail.component';
import { GerantCaisseUpdateComponent } from './update/gerant-caisse-update.component';
import GerantCaisseResolve from './route/gerant-caisse-routing-resolve.service';

const gerantCaisseRoute: Routes = [
  {
    path: '',
    component: GerantCaisseComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GerantCaisseDetailComponent,
    resolve: {
      gerantCaisse: GerantCaisseResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GerantCaisseUpdateComponent,
    resolve: {
      gerantCaisse: GerantCaisseResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GerantCaisseUpdateComponent,
    resolve: {
      gerantCaisse: GerantCaisseResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default gerantCaisseRoute;
