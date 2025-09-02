import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEtatOperation } from '../etat-operation.model';
import { EtatOperationService } from '../service/etat-operation.service';

export const etatOperationResolve = (route: ActivatedRouteSnapshot): Observable<null | IEtatOperation> => {
  const id = route.params['id'];
  if (id) {
    return inject(EtatOperationService)
      .find(id)
      .pipe(
        mergeMap((etatOperation: HttpResponse<IEtatOperation>) => {
          if (etatOperation.body) {
            return of(etatOperation.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default etatOperationResolve;
