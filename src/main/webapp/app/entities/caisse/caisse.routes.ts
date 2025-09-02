import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { CaisseComponent } from './list/caisse.component';
import { CaisseDetailComponent } from './detail/caisse-detail.component';
import { CaisseUpdateComponent } from './update/caisse-update.component';
import CaisseResolve from './route/caisse-routing-resolve.service';

const caisseRoute: Routes = [
  {
    path: '',
    component: CaisseComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CaisseDetailComponent,
    resolve: {
      caisse: CaisseResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CaisseUpdateComponent,
    resolve: {
      caisse: CaisseResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CaisseUpdateComponent,
    resolve: {
      caisse: CaisseResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default caisseRoute;
