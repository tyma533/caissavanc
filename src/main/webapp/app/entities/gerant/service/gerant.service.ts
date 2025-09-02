import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGerant, NewGerant } from '../gerant.model';

export type PartialUpdateGerant = Partial<IGerant> & Pick<IGerant, 'id'>;

type RestOf<T extends IGerant | NewGerant> = Omit<T, 'dateNomination' | 'dateFin' | 'dateHeureModification' | 'dateHeureCreation'> & {
  dateNomination?: string | null;
  dateFin?: string | null;
  dateHeureModification?: string | null;
  dateHeureCreation?: string | null;
};

export type RestGerant = RestOf<IGerant>;

export type NewRestGerant = RestOf<NewGerant>;

export type PartialUpdateRestGerant = RestOf<PartialUpdateGerant>;

export type EntityResponseType = HttpResponse<IGerant>;
export type EntityArrayResponseType = HttpResponse<IGerant[]>;

@Injectable({ providedIn: 'root' })
export class GerantService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/gerants');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(gerant: NewGerant): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(gerant);
    return this.http
      .post<RestGerant>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(gerant: IGerant): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(gerant);
    return this.http
      .put<RestGerant>(`${this.resourceUrl}/${this.getGerantIdentifier(gerant)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(gerant: PartialUpdateGerant): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(gerant);
    return this.http
      .patch<RestGerant>(`${this.resourceUrl}/${this.getGerantIdentifier(gerant)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestGerant>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestGerant[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getGerantIdentifier(gerant: Pick<IGerant, 'id'>): number {
    return gerant.id;
  }

  compareGerant(o1: Pick<IGerant, 'id'> | null, o2: Pick<IGerant, 'id'> | null): boolean {
    return o1 && o2 ? this.getGerantIdentifier(o1) === this.getGerantIdentifier(o2) : o1 === o2;
  }

  addGerantToCollectionIfMissing<Type extends Pick<IGerant, 'id'>>(
    gerantCollection: Type[],
    ...gerantsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const gerants: Type[] = gerantsToCheck.filter(isPresent);
    if (gerants.length > 0) {
      const gerantCollectionIdentifiers = gerantCollection.map(gerantItem => this.getGerantIdentifier(gerantItem)!);
      const gerantsToAdd = gerants.filter(gerantItem => {
        const gerantIdentifier = this.getGerantIdentifier(gerantItem);
        if (gerantCollectionIdentifiers.includes(gerantIdentifier)) {
          return false;
        }
        gerantCollectionIdentifiers.push(gerantIdentifier);
        return true;
      });
      return [...gerantsToAdd, ...gerantCollection];
    }
    return gerantCollection;
  }

  protected convertDateFromClient<T extends IGerant | NewGerant | PartialUpdateGerant>(gerant: T): RestOf<T> {
    return {
      ...gerant,
      dateNomination: gerant.dateNomination?.toJSON() ?? null,
      dateFin: gerant.dateFin?.toJSON() ?? null,
      dateHeureModification: gerant.dateHeureModification?.toJSON() ?? null,
      dateHeureCreation: gerant.dateHeureCreation?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restGerant: RestGerant): IGerant {
    return {
      ...restGerant,
      dateNomination: restGerant.dateNomination ? dayjs(restGerant.dateNomination) : undefined,
      dateFin: restGerant.dateFin ? dayjs(restGerant.dateFin) : undefined,
      dateHeureModification: restGerant.dateHeureModification ? dayjs(restGerant.dateHeureModification) : undefined,
      dateHeureCreation: restGerant.dateHeureCreation ? dayjs(restGerant.dateHeureCreation) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestGerant>): HttpResponse<IGerant> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestGerant[]>): HttpResponse<IGerant[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
