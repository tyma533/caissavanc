import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGerant } from '../gerant.model';
import { GerantService } from '../service/gerant.service';

export const gerantResolve = (route: ActivatedRouteSnapshot): Observable<null | IGerant> => {
  const id = route.params['id'];
  if (id) {
    return inject(GerantService)
      .find(id)
      .pipe(
        mergeMap((gerant: HttpResponse<IGerant>) => {
          if (gerant.body) {
            return of(gerant.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default gerantResolve;
