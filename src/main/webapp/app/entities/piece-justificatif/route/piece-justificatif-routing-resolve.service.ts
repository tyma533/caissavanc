import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPieceJustificatif } from '../piece-justificatif.model';
import { PieceJustificatifService } from '../service/piece-justificatif.service';

export const pieceJustificatifResolve = (route: ActivatedRouteSnapshot): Observable<null | IPieceJustificatif> => {
  const id = route.params['id'];
  if (id) {
    return inject(PieceJustificatifService)
      .find(id)
      .pipe(
        mergeMap((pieceJustificatif: HttpResponse<IPieceJustificatif>) => {
          if (pieceJustificatif.body) {
            return of(pieceJustificatif.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default pieceJustificatifResolve;
