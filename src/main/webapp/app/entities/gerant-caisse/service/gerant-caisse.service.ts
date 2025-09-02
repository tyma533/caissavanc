import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGerantCaisse, NewGerantCaisse } from '../gerant-caisse.model';

export type PartialUpdateGerantCaisse = Partial<IGerantCaisse> & Pick<IGerantCaisse, 'id'>;

type RestOf<T extends IGerantCaisse | NewGerantCaisse> = Omit<T, 'dateHeureModification' | 'dateHeureCreation'> & {
  dateHeureModification?: string | null;
  dateHeureCreation?: string | null;
};

export type RestGerantCaisse = RestOf<IGerantCaisse>;

export type NewRestGerantCaisse = RestOf<NewGerantCaisse>;

export type PartialUpdateRestGerantCaisse = RestOf<PartialUpdateGerantCaisse>;

export type EntityResponseType = HttpResponse<IGerantCaisse>;
export type EntityArrayResponseType = HttpResponse<IGerantCaisse[]>;

@Injectable({ providedIn: 'root' })
export class GerantCaisseService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/gerant-caisses');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(gerantCaisse: NewGerantCaisse): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(gerantCaisse);
    return this.http
      .post<RestGerantCaisse>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(gerantCaisse: IGerantCaisse): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(gerantCaisse);
    return this.http
      .put<RestGerantCaisse>(`${this.resourceUrl}/${this.getGerantCaisseIdentifier(gerantCaisse)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(gerantCaisse: PartialUpdateGerantCaisse): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(gerantCaisse);
    return this.http
      .patch<RestGerantCaisse>(`${this.resourceUrl}/${this.getGerantCaisseIdentifier(gerantCaisse)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestGerantCaisse>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestGerantCaisse[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getGerantCaisseIdentifier(gerantCaisse: Pick<IGerantCaisse, 'id'>): number {
    return gerantCaisse.id;
  }

  compareGerantCaisse(o1: Pick<IGerantCaisse, 'id'> | null, o2: Pick<IGerantCaisse, 'id'> | null): boolean {
    return o1 && o2 ? this.getGerantCaisseIdentifier(o1) === this.getGerantCaisseIdentifier(o2) : o1 === o2;
  }

  addGerantCaisseToCollectionIfMissing<Type extends Pick<IGerantCaisse, 'id'>>(
    gerantCaisseCollection: Type[],
    ...gerantCaissesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const gerantCaisses: Type[] = gerantCaissesToCheck.filter(isPresent);
    if (gerantCaisses.length > 0) {
      const gerantCaisseCollectionIdentifiers = gerantCaisseCollection.map(
        gerantCaisseItem => this.getGerantCaisseIdentifier(gerantCaisseItem)!,
      );
      const gerantCaissesToAdd = gerantCaisses.filter(gerantCaisseItem => {
        const gerantCaisseIdentifier = this.getGerantCaisseIdentifier(gerantCaisseItem);
        if (gerantCaisseCollectionIdentifiers.includes(gerantCaisseIdentifier)) {
          return false;
        }
        gerantCaisseCollectionIdentifiers.push(gerantCaisseIdentifier);
        return true;
      });
      return [...gerantCaissesToAdd, ...gerantCaisseCollection];
    }
    return gerantCaisseCollection;
  }

  protected convertDateFromClient<T extends IGerantCaisse | NewGerantCaisse | PartialUpdateGerantCaisse>(gerantCaisse: T): RestOf<T> {
    return {
      ...gerantCaisse,
      dateHeureModification: gerantCaisse.dateHeureModification?.toJSON() ?? null,
      dateHeureCreation: gerantCaisse.dateHeureCreation?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restGerantCaisse: RestGerantCaisse): IGerantCaisse {
    return {
      ...restGerantCaisse,
      dateHeureModification: restGerantCaisse.dateHeureModification ? dayjs(restGerantCaisse.dateHeureModification) : undefined,
      dateHeureCreation: restGerantCaisse.dateHeureCreation ? dayjs(restGerantCaisse.dateHeureCreation) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestGerantCaisse>): HttpResponse<IGerantCaisse> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestGerantCaisse[]>): HttpResponse<IGerantCaisse[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
