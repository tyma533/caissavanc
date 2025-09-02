import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ControleComponent } from './list/controle.component';
import { ControleDetailComponent } from './detail/controle-detail.component';
import { ControleUpdateComponent } from './update/controle-update.component';
import ControleResolve from './route/controle-routing-resolve.service';

const controleRoute: Routes = [
  {
    path: '',
    component: ControleComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ControleDetailComponent,
    resolve: {
      controle: ControleResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ControleUpdateComponent,
    resolve: {
      controle: ControleResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ControleUpdateComponent,
    resolve: {
      controle: ControleResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default controleRoute;
