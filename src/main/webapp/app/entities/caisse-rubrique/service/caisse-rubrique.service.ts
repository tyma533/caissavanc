import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICaisseRubrique, NewCaisseRubrique } from '../caisse-rubrique.model';

export type PartialUpdateCaisseRubrique = Partial<ICaisseRubrique> & Pick<ICaisseRubrique, 'id'>;

type RestOf<T extends ICaisseRubrique | NewCaisseRubrique> = Omit<T, 'dateHeureModification' | 'dateHeureCreation'> & {
  dateHeureModification?: string | null;
  dateHeureCreation?: string | null;
};

export type RestCaisseRubrique = RestOf<ICaisseRubrique>;

export type NewRestCaisseRubrique = RestOf<NewCaisseRubrique>;

export type PartialUpdateRestCaisseRubrique = RestOf<PartialUpdateCaisseRubrique>;

export type EntityResponseType = HttpResponse<ICaisseRubrique>;
export type EntityArrayResponseType = HttpResponse<ICaisseRubrique[]>;

@Injectable({ providedIn: 'root' })
export class CaisseRubriqueService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/caisse-rubriques');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(caisseRubrique: NewCaisseRubrique): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(caisseRubrique);
    return this.http
      .post<RestCaisseRubrique>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(caisseRubrique: ICaisseRubrique): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(caisseRubrique);
    return this.http
      .put<RestCaisseRubrique>(`${this.resourceUrl}/${this.getCaisseRubriqueIdentifier(caisseRubrique)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(caisseRubrique: PartialUpdateCaisseRubrique): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(caisseRubrique);
    return this.http
      .patch<RestCaisseRubrique>(`${this.resourceUrl}/${this.getCaisseRubriqueIdentifier(caisseRubrique)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestCaisseRubrique>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestCaisseRubrique[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCaisseRubriqueIdentifier(caisseRubrique: Pick<ICaisseRubrique, 'id'>): number {
    return caisseRubrique.id;
  }

  compareCaisseRubrique(o1: Pick<ICaisseRubrique, 'id'> | null, o2: Pick<ICaisseRubrique, 'id'> | null): boolean {
    return o1 && o2 ? this.getCaisseRubriqueIdentifier(o1) === this.getCaisseRubriqueIdentifier(o2) : o1 === o2;
  }

  addCaisseRubriqueToCollectionIfMissing<Type extends Pick<ICaisseRubrique, 'id'>>(
    caisseRubriqueCollection: Type[],
    ...caisseRubriquesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const caisseRubriques: Type[] = caisseRubriquesToCheck.filter(isPresent);
    if (caisseRubriques.length > 0) {
      const caisseRubriqueCollectionIdentifiers = caisseRubriqueCollection.map(
        caisseRubriqueItem => this.getCaisseRubriqueIdentifier(caisseRubriqueItem)!,
      );
      const caisseRubriquesToAdd = caisseRubriques.filter(caisseRubriqueItem => {
        const caisseRubriqueIdentifier = this.getCaisseRubriqueIdentifier(caisseRubriqueItem);
        if (caisseRubriqueCollectionIdentifiers.includes(caisseRubriqueIdentifier)) {
          return false;
        }
        caisseRubriqueCollectionIdentifiers.push(caisseRubriqueIdentifier);
        return true;
      });
      return [...caisseRubriquesToAdd, ...caisseRubriqueCollection];
    }
    return caisseRubriqueCollection;
  }

  protected convertDateFromClient<T extends ICaisseRubrique | NewCaisseRubrique | PartialUpdateCaisseRubrique>(
    caisseRubrique: T,
  ): RestOf<T> {
    return {
      ...caisseRubrique,
      dateHeureModification: caisseRubrique.dateHeureModification?.toJSON() ?? null,
      dateHeureCreation: caisseRubrique.dateHeureCreation?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restCaisseRubrique: RestCaisseRubrique): ICaisseRubrique {
    return {
      ...restCaisseRubrique,
      dateHeureModification: restCaisseRubrique.dateHeureModification ? dayjs(restCaisseRubrique.dateHeureModification) : undefined,
      dateHeureCreation: restCaisseRubrique.dateHeureCreation ? dayjs(restCaisseRubrique.dateHeureCreation) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestCaisseRubrique>): HttpResponse<ICaisseRubrique> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestCaisseRubrique[]>): HttpResponse<ICaisseRubrique[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
