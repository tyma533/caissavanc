import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { TypeOperationComponent } from './list/type-operation.component';
import { TypeOperationDetailComponent } from './detail/type-operation-detail.component';
import { TypeOperationUpdateComponent } from './update/type-operation-update.component';
import TypeOperationResolve from './route/type-operation-routing-resolve.service';

const typeOperationRoute: Routes = [
  {
    path: '',
    component: TypeOperationComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TypeOperationDetailComponent,
    resolve: {
      typeOperation: TypeOperationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TypeOperationUpdateComponent,
    resolve: {
      typeOperation: TypeOperationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TypeOperationUpdateComponent,
    resolve: {
      typeOperation: TypeOperationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default typeOperationRoute;
