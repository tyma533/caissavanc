import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { EtatOperationComponent } from './list/etat-operation.component';
import { EtatOperationDetailComponent } from './detail/etat-operation-detail.component';
import { EtatOperationUpdateComponent } from './update/etat-operation-update.component';
import EtatOperationResolve from './route/etat-operation-routing-resolve.service';

const etatOperationRoute: Routes = [
  {
    path: '',
    component: EtatOperationComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EtatOperationDetailComponent,
    resolve: {
      etatOperation: EtatOperationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EtatOperationUpdateComponent,
    resolve: {
      etatOperation: EtatOperationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EtatOperationUpdateComponent,
    resolve: {
      etatOperation: EtatOperationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default etatOperationRoute;
