import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { CaisseRubriqueComponent } from './list/caisse-rubrique.component';
import { CaisseRubriqueDetailComponent } from './detail/caisse-rubrique-detail.component';
import { CaisseRubriqueUpdateComponent } from './update/caisse-rubrique-update.component';
import CaisseRubriqueResolve from './route/caisse-rubrique-routing-resolve.service';

const caisseRubriqueRoute: Routes = [
  {
    path: '',
    component: CaisseRubriqueComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CaisseRubriqueDetailComponent,
    resolve: {
      caisseRubrique: CaisseRubriqueResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CaisseRubriqueUpdateComponent,
    resolve: {
      caisseRubrique: CaisseRubriqueResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CaisseRubriqueUpdateComponent,
    resolve: {
      caisseRubrique: CaisseRubriqueResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default caisseRubriqueRoute;
