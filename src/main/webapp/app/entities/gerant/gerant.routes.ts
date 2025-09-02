import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { GerantComponent } from './list/gerant.component';
import { GerantDetailComponent } from './detail/gerant-detail.component';
import { GerantUpdateComponent } from './update/gerant-update.component';
import GerantResolve from './route/gerant-routing-resolve.service';

const gerantRoute: Routes = [
  {
    path: '',
    component: GerantComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GerantDetailComponent,
    resolve: {
      gerant: GerantResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GerantUpdateComponent,
    resolve: {
      gerant: GerantResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GerantUpdateComponent,
    resolve: {
      gerant: GerantResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default gerantRoute;
