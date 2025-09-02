import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICaisseRubrique } from '../caisse-rubrique.model';
import { CaisseRubriqueService } from '../service/caisse-rubrique.service';

export const caisseRubriqueResolve = (route: ActivatedRouteSnapshot): Observable<null | ICaisseRubrique> => {
  const id = route.params['id'];
  if (id) {
    return inject(CaisseRubriqueService)
      .find(id)
      .pipe(
        mergeMap((caisseRubrique: HttpResponse<ICaisseRubrique>) => {
          if (caisseRubrique.body) {
            return of(caisseRubrique.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default caisseRubriqueResolve;
