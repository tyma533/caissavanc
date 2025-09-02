import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRubrique, NewRubrique } from '../rubrique.model';

export type PartialUpdateRubrique = Partial<IRubrique> & Pick<IRubrique, 'id'>;

type RestOf<T extends IRubrique | NewRubrique> = Omit<T, 'dateHeureModification' | 'dateHeureCreation'> & {
  dateHeureModification?: string | null;
  dateHeureCreation?: string | null;
};

export type RestRubrique = RestOf<IRubrique>;

export type NewRestRubrique = RestOf<NewRubrique>;

export type PartialUpdateRestRubrique = RestOf<PartialUpdateRubrique>;

export type EntityResponseType = HttpResponse<IRubrique>;
export type EntityArrayResponseType = HttpResponse<IRubrique[]>;

@Injectable({ providedIn: 'root' })
export class RubriqueService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/rubriques');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(rubrique: NewRubrique): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(rubrique);
    return this.http
      .post<RestRubrique>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(rubrique: IRubrique): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(rubrique);
    return this.http
      .put<RestRubrique>(`${this.resourceUrl}/${this.getRubriqueIdentifier(rubrique)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(rubrique: PartialUpdateRubrique): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(rubrique);
    return this.http
      .patch<RestRubrique>(`${this.resourceUrl}/${this.getRubriqueIdentifier(rubrique)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestRubrique>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestRubrique[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getRubriqueIdentifier(rubrique: Pick<IRubrique, 'id'>): number {
    return rubrique.id;
  }

  compareRubrique(o1: Pick<IRubrique, 'id'> | null, o2: Pick<IRubrique, 'id'> | null): boolean {
    return o1 && o2 ? this.getRubriqueIdentifier(o1) === this.getRubriqueIdentifier(o2) : o1 === o2;
  }

  addRubriqueToCollectionIfMissing<Type extends Pick<IRubrique, 'id'>>(
    rubriqueCollection: Type[],
    ...rubriquesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const rubriques: Type[] = rubriquesToCheck.filter(isPresent);
    if (rubriques.length > 0) {
      const rubriqueCollectionIdentifiers = rubriqueCollection.map(rubriqueItem => this.getRubriqueIdentifier(rubriqueItem)!);
      const rubriquesToAdd = rubriques.filter(rubriqueItem => {
        const rubriqueIdentifier = this.getRubriqueIdentifier(rubriqueItem);
        if (rubriqueCollectionIdentifiers.includes(rubriqueIdentifier)) {
          return false;
        }
        rubriqueCollectionIdentifiers.push(rubriqueIdentifier);
        return true;
      });
      return [...rubriquesToAdd, ...rubriqueCollection];
    }
    return rubriqueCollection;
  }

  protected convertDateFromClient<T extends IRubrique | NewRubrique | PartialUpdateRubrique>(rubrique: T): RestOf<T> {
    return {
      ...rubrique,
      dateHeureModification: rubrique.dateHeureModification?.toJSON() ?? null,
      dateHeureCreation: rubrique.dateHeureCreation?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restRubrique: RestRubrique): IRubrique {
    return {
      ...restRubrique,
      dateHeureModification: restRubrique.dateHeureModification ? dayjs(restRubrique.dateHeureModification) : undefined,
      dateHeureCreation: restRubrique.dateHeureCreation ? dayjs(restRubrique.dateHeureCreation) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestRubrique>): HttpResponse<IRubrique> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestRubrique[]>): HttpResponse<IRubrique[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
