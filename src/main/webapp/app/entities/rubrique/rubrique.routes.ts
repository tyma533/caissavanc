import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { RubriqueComponent } from './list/rubrique.component';
import { RubriqueDetailComponent } from './detail/rubrique-detail.component';
import { RubriqueUpdateComponent } from './update/rubrique-update.component';
import RubriqueResolve from './route/rubrique-routing-resolve.service';

const rubriqueRoute: Routes = [
  {
    path: '',
    component: RubriqueComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RubriqueDetailComponent,
    resolve: {
      rubrique: RubriqueResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RubriqueUpdateComponent,
    resolve: {
      rubrique: RubriqueResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RubriqueUpdateComponent,
    resolve: {
      rubrique: RubriqueResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default rubriqueRoute;
