import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAgentEtatProfil, NewAgentEtatProfil } from '../agent-etat-profil.model';

export type PartialUpdateAgentEtatProfil = Partial<IAgentEtatProfil> & Pick<IAgentEtatProfil, 'id'>;

type RestOf<T extends IAgentEtatProfil | NewAgentEtatProfil> = Omit<T, 'dateHeureModification' | 'dateHeureCreation'> & {
  dateHeureModification?: string | null;
  dateHeureCreation?: string | null;
};

export type RestAgentEtatProfil = RestOf<IAgentEtatProfil>;

export type NewRestAgentEtatProfil = RestOf<NewAgentEtatProfil>;

export type PartialUpdateRestAgentEtatProfil = RestOf<PartialUpdateAgentEtatProfil>;

export type EntityResponseType = HttpResponse<IAgentEtatProfil>;
export type EntityArrayResponseType = HttpResponse<IAgentEtatProfil[]>;

@Injectable({ providedIn: 'root' })
export class AgentEtatProfilService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/agent-etat-profils');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(agentEtatProfil: NewAgentEtatProfil): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(agentEtatProfil);
    return this.http
      .post<RestAgentEtatProfil>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(agentEtatProfil: IAgentEtatProfil): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(agentEtatProfil);
    return this.http
      .put<RestAgentEtatProfil>(`${this.resourceUrl}/${this.getAgentEtatProfilIdentifier(agentEtatProfil)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(agentEtatProfil: PartialUpdateAgentEtatProfil): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(agentEtatProfil);
    return this.http
      .patch<RestAgentEtatProfil>(`${this.resourceUrl}/${this.getAgentEtatProfilIdentifier(agentEtatProfil)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestAgentEtatProfil>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAgentEtatProfil[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAgentEtatProfilIdentifier(agentEtatProfil: Pick<IAgentEtatProfil, 'id'>): number {
    return agentEtatProfil.id;
  }

  compareAgentEtatProfil(o1: Pick<IAgentEtatProfil, 'id'> | null, o2: Pick<IAgentEtatProfil, 'id'> | null): boolean {
    return o1 && o2 ? this.getAgentEtatProfilIdentifier(o1) === this.getAgentEtatProfilIdentifier(o2) : o1 === o2;
  }

  addAgentEtatProfilToCollectionIfMissing<Type extends Pick<IAgentEtatProfil, 'id'>>(
    agentEtatProfilCollection: Type[],
    ...agentEtatProfilsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const agentEtatProfils: Type[] = agentEtatProfilsToCheck.filter(isPresent);
    if (agentEtatProfils.length > 0) {
      const agentEtatProfilCollectionIdentifiers = agentEtatProfilCollection.map(
        agentEtatProfilItem => this.getAgentEtatProfilIdentifier(agentEtatProfilItem)!,
      );
      const agentEtatProfilsToAdd = agentEtatProfils.filter(agentEtatProfilItem => {
        const agentEtatProfilIdentifier = this.getAgentEtatProfilIdentifier(agentEtatProfilItem);
        if (agentEtatProfilCollectionIdentifiers.includes(agentEtatProfilIdentifier)) {
          return false;
        }
        agentEtatProfilCollectionIdentifiers.push(agentEtatProfilIdentifier);
        return true;
      });
      return [...agentEtatProfilsToAdd, ...agentEtatProfilCollection];
    }
    return agentEtatProfilCollection;
  }

  protected convertDateFromClient<T extends IAgentEtatProfil | NewAgentEtatProfil | PartialUpdateAgentEtatProfil>(
    agentEtatProfil: T,
  ): RestOf<T> {
    return {
      ...agentEtatProfil,
      dateHeureModification: agentEtatProfil.dateHeureModification?.toJSON() ?? null,
      dateHeureCreation: agentEtatProfil.dateHeureCreation?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restAgentEtatProfil: RestAgentEtatProfil): IAgentEtatProfil {
    return {
      ...restAgentEtatProfil,
      dateHeureModification: restAgentEtatProfil.dateHeureModification ? dayjs(restAgentEtatProfil.dateHeureModification) : undefined,
      dateHeureCreation: restAgentEtatProfil.dateHeureCreation ? dayjs(restAgentEtatProfil.dateHeureCreation) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestAgentEtatProfil>): HttpResponse<IAgentEtatProfil> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestAgentEtatProfil[]>): HttpResponse<IAgentEtatProfil[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
