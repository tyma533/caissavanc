import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { PieceJustificatifComponent } from './list/piece-justificatif.component';
import { PieceJustificatifDetailComponent } from './detail/piece-justificatif-detail.component';
import { PieceJustificatifUpdateComponent } from './update/piece-justificatif-update.component';
import PieceJustificatifResolve from './route/piece-justificatif-routing-resolve.service';

const pieceJustificatifRoute: Routes = [
  {
    path: '',
    component: PieceJustificatifComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PieceJustificatifDetailComponent,
    resolve: {
      pieceJustificatif: PieceJustificatifResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PieceJustificatifUpdateComponent,
    resolve: {
      pieceJustificatif: PieceJustificatifResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PieceJustificatifUpdateComponent,
    resolve: {
      pieceJustificatif: PieceJustificatifResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default pieceJustificatifRoute;
