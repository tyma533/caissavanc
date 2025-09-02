import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IModeOperation } from '../mode-operation.model';
import { ModeOperationService } from '../service/mode-operation.service';

export const modeOperationResolve = (route: ActivatedRouteSnapshot): Observable<null | IModeOperation> => {
  const id = route.params['id'];
  if (id) {
    return inject(ModeOperationService)
      .find(id)
      .pipe(
        mergeMap((modeOperation: HttpResponse<IModeOperation>) => {
          if (modeOperation.body) {
            return of(modeOperation.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default modeOperationResolve;
