import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ModeOperationComponent } from './list/mode-operation.component';
import { ModeOperationDetailComponent } from './detail/mode-operation-detail.component';
import { ModeOperationUpdateComponent } from './update/mode-operation-update.component';
import ModeOperationResolve from './route/mode-operation-routing-resolve.service';

const modeOperationRoute: Routes = [
  {
    path: '',
    component: ModeOperationComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ModeOperationDetailComponent,
    resolve: {
      modeOperation: ModeOperationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ModeOperationUpdateComponent,
    resolve: {
      modeOperation: ModeOperationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ModeOperationUpdateComponent,
    resolve: {
      modeOperation: ModeOperationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default modeOperationRoute;
