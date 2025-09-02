import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAgentEtatProfil } from '../agent-etat-profil.model';
import { AgentEtatProfilService } from '../service/agent-etat-profil.service';

export const agentEtatProfilResolve = (route: ActivatedRouteSnapshot): Observable<null | IAgentEtatProfil> => {
  const id = route.params['id'];
  if (id) {
    return inject(AgentEtatProfilService)
      .find(id)
      .pipe(
        mergeMap((agentEtatProfil: HttpResponse<IAgentEtatProfil>) => {
          if (agentEtatProfil.body) {
            return of(agentEtatProfil.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default agentEtatProfilResolve;
