import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEtablissement, NewEtablissement } from '../etablissement.model';

export type PartialUpdateEtablissement = Partial<IEtablissement> & Pick<IEtablissement, 'id'>;

type RestOf<T extends IEtablissement | NewEtablissement> = Omit<T, 'dateHeureModification' | 'dateHeureCreation'> & {
  dateHeureModification?: string | null;
  dateHeureCreation?: string | null;
};

export type RestEtablissement = RestOf<IEtablissement>;

export type NewRestEtablissement = RestOf<NewEtablissement>;

export type PartialUpdateRestEtablissement = RestOf<PartialUpdateEtablissement>;

export type EntityResponseType = HttpResponse<IEtablissement>;
export type EntityArrayResponseType = HttpResponse<IEtablissement[]>;

@Injectable({ providedIn: 'root' })
export class EtablissementService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/etablissements');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(etablissement: NewEtablissement): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(etablissement);
    return this.http
      .post<RestEtablissement>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(etablissement: IEtablissement): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(etablissement);
    return this.http
      .put<RestEtablissement>(`${this.resourceUrl}/${this.getEtablissementIdentifier(etablissement)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(etablissement: PartialUpdateEtablissement): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(etablissement);
    return this.http
      .patch<RestEtablissement>(`${this.resourceUrl}/${this.getEtablissementIdentifier(etablissement)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestEtablissement>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestEtablissement[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEtablissementIdentifier(etablissement: Pick<IEtablissement, 'id'>): number {
    return etablissement.id;
  }

  compareEtablissement(o1: Pick<IEtablissement, 'id'> | null, o2: Pick<IEtablissement, 'id'> | null): boolean {
    return o1 && o2 ? this.getEtablissementIdentifier(o1) === this.getEtablissementIdentifier(o2) : o1 === o2;
  }

  addEtablissementToCollectionIfMissing<Type extends Pick<IEtablissement, 'id'>>(
    etablissementCollection: Type[],
    ...etablissementsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const etablissements: Type[] = etablissementsToCheck.filter(isPresent);
    if (etablissements.length > 0) {
      const etablissementCollectionIdentifiers = etablissementCollection.map(
        etablissementItem => this.getEtablissementIdentifier(etablissementItem)!,
      );
      const etablissementsToAdd = etablissements.filter(etablissementItem => {
        const etablissementIdentifier = this.getEtablissementIdentifier(etablissementItem);
        if (etablissementCollectionIdentifiers.includes(etablissementIdentifier)) {
          return false;
        }
        etablissementCollectionIdentifiers.push(etablissementIdentifier);
        return true;
      });
      return [...etablissementsToAdd, ...etablissementCollection];
    }
    return etablissementCollection;
  }

  protected convertDateFromClient<T extends IEtablissement | NewEtablissement | PartialUpdateEtablissement>(etablissement: T): RestOf<T> {
    return {
      ...etablissement,
      dateHeureModification: etablissement.dateHeureModification?.toJSON() ?? null,
      dateHeureCreation: etablissement.dateHeureCreation?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restEtablissement: RestEtablissement): IEtablissement {
    return {
      ...restEtablissement,
      dateHeureModification: restEtablissement.dateHeureModification ? dayjs(restEtablissement.dateHeureModification) : undefined,
      dateHeureCreation: restEtablissement.dateHeureCreation ? dayjs(restEtablissement.dateHeureCreation) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestEtablissement>): HttpResponse<IEtablissement> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestEtablissement[]>): HttpResponse<IEtablissement[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
