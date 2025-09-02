import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IControle } from '../controle.model';
import { ControleService } from '../service/controle.service';

export const controleResolve = (route: ActivatedRouteSnapshot): Observable<null | IControle> => {
  const id = route.params['id'];
  if (id) {
    return inject(ControleService)
      .find(id)
      .pipe(
        mergeMap((controle: HttpResponse<IControle>) => {
          if (controle.body) {
            return of(controle.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default controleResolve;
