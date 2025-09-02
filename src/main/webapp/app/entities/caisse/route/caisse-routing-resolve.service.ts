import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICaisse } from '../caisse.model';
import { CaisseService } from '../service/caisse.service';

export const caisseResolve = (route: ActivatedRouteSnapshot): Observable<null | ICaisse> => {
  const id = route.params['id'];
  if (id) {
    return inject(CaisseService)
      .find(id)
      .pipe(
        mergeMap((caisse: HttpResponse<ICaisse>) => {
          if (caisse.body) {
            return of(caisse.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default caisseResolve;
