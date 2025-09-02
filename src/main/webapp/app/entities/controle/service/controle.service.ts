import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IControle, NewControle } from '../controle.model';

export type PartialUpdateControle = Partial<IControle> & Pick<IControle, 'id'>;

type RestOf<T extends IControle | NewControle> = Omit<T, 'dateControle' | 'dateHeureModification' | 'dateHeureCreation'> & {
  dateControle?: string | null;
  dateHeureModification?: string | null;
  dateHeureCreation?: string | null;
};

export type RestControle = RestOf<IControle>;

export type NewRestControle = RestOf<NewControle>;

export type PartialUpdateRestControle = RestOf<PartialUpdateControle>;

export type EntityResponseType = HttpResponse<IControle>;
export type EntityArrayResponseType = HttpResponse<IControle[]>;

@Injectable({ providedIn: 'root' })
export class ControleService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/controles');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(controle: NewControle): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(controle);
    return this.http
      .post<RestControle>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(controle: IControle): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(controle);
    return this.http
      .put<RestControle>(`${this.resourceUrl}/${this.getControleIdentifier(controle)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(controle: PartialUpdateControle): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(controle);
    return this.http
      .patch<RestControle>(`${this.resourceUrl}/${this.getControleIdentifier(controle)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestControle>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestControle[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getControleIdentifier(controle: Pick<IControle, 'id'>): number {
    return controle.id;
  }

  compareControle(o1: Pick<IControle, 'id'> | null, o2: Pick<IControle, 'id'> | null): boolean {
    return o1 && o2 ? this.getControleIdentifier(o1) === this.getControleIdentifier(o2) : o1 === o2;
  }

  addControleToCollectionIfMissing<Type extends Pick<IControle, 'id'>>(
    controleCollection: Type[],
    ...controlesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const controles: Type[] = controlesToCheck.filter(isPresent);
    if (controles.length > 0) {
      const controleCollectionIdentifiers = controleCollection.map(controleItem => this.getControleIdentifier(controleItem)!);
      const controlesToAdd = controles.filter(controleItem => {
        const controleIdentifier = this.getControleIdentifier(controleItem);
        if (controleCollectionIdentifiers.includes(controleIdentifier)) {
          return false;
        }
        controleCollectionIdentifiers.push(controleIdentifier);
        return true;
      });
      return [...controlesToAdd, ...controleCollection];
    }
    return controleCollection;
  }

  protected convertDateFromClient<T extends IControle | NewControle | PartialUpdateControle>(controle: T): RestOf<T> {
    return {
      ...controle,
      dateControle: controle.dateControle?.toJSON() ?? null,
      dateHeureModification: controle.dateHeureModification?.toJSON() ?? null,
      dateHeureCreation: controle.dateHeureCreation?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restControle: RestControle): IControle {
    return {
      ...restControle,
      dateControle: restControle.dateControle ? dayjs(restControle.dateControle) : undefined,
      dateHeureModification: restControle.dateHeureModification ? dayjs(restControle.dateHeureModification) : undefined,
      dateHeureCreation: restControle.dateHeureCreation ? dayjs(restControle.dateHeureCreation) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestControle>): HttpResponse<IControle> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestControle[]>): HttpResponse<IControle[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
