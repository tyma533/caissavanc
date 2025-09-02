import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGerantCaisse } from '../gerant-caisse.model';
import { GerantCaisseService } from '../service/gerant-caisse.service';

export const gerantCaisseResolve = (route: ActivatedRouteSnapshot): Observable<null | IGerantCaisse> => {
  const id = route.params['id'];
  if (id) {
    return inject(GerantCaisseService)
      .find(id)
      .pipe(
        mergeMap((gerantCaisse: HttpResponse<IGerantCaisse>) => {
          if (gerantCaisse.body) {
            return of(gerantCaisse.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default gerantCaisseResolve;
