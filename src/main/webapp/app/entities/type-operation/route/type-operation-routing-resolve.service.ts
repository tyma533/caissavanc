import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITypeOperation } from '../type-operation.model';
import { TypeOperationService } from '../service/type-operation.service';

export const typeOperationResolve = (route: ActivatedRouteSnapshot): Observable<null | ITypeOperation> => {
  const id = route.params['id'];
  if (id) {
    return inject(TypeOperationService)
      .find(id)
      .pipe(
        mergeMap((typeOperation: HttpResponse<ITypeOperation>) => {
          if (typeOperation.body) {
            return of(typeOperation.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default typeOperationResolve;
