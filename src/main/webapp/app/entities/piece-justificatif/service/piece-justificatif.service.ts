import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPieceJustificatif, NewPieceJustificatif } from '../piece-justificatif.model';

export type PartialUpdatePieceJustificatif = Partial<IPieceJustificatif> & Pick<IPieceJustificatif, 'id'>;

type RestOf<T extends IPieceJustificatif | NewPieceJustificatif> = Omit<T, 'dateHeureModification' | 'dateHeureCreation'> & {
  dateHeureModification?: string | null;
  dateHeureCreation?: string | null;
};

export type RestPieceJustificatif = RestOf<IPieceJustificatif>;

export type NewRestPieceJustificatif = RestOf<NewPieceJustificatif>;

export type PartialUpdateRestPieceJustificatif = RestOf<PartialUpdatePieceJustificatif>;

export type EntityResponseType = HttpResponse<IPieceJustificatif>;
export type EntityArrayResponseType = HttpResponse<IPieceJustificatif[]>;

@Injectable({ providedIn: 'root' })
export class PieceJustificatifService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/piece-justificatifs');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(pieceJustificatif: NewPieceJustificatif): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pieceJustificatif);
    return this.http
      .post<RestPieceJustificatif>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(pieceJustificatif: IPieceJustificatif): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pieceJustificatif);
    return this.http
      .put<RestPieceJustificatif>(`${this.resourceUrl}/${this.getPieceJustificatifIdentifier(pieceJustificatif)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(pieceJustificatif: PartialUpdatePieceJustificatif): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pieceJustificatif);
    return this.http
      .patch<RestPieceJustificatif>(`${this.resourceUrl}/${this.getPieceJustificatifIdentifier(pieceJustificatif)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPieceJustificatif>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPieceJustificatif[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPieceJustificatifIdentifier(pieceJustificatif: Pick<IPieceJustificatif, 'id'>): number {
    return pieceJustificatif.id;
  }

  comparePieceJustificatif(o1: Pick<IPieceJustificatif, 'id'> | null, o2: Pick<IPieceJustificatif, 'id'> | null): boolean {
    return o1 && o2 ? this.getPieceJustificatifIdentifier(o1) === this.getPieceJustificatifIdentifier(o2) : o1 === o2;
  }

  addPieceJustificatifToCollectionIfMissing<Type extends Pick<IPieceJustificatif, 'id'>>(
    pieceJustificatifCollection: Type[],
    ...pieceJustificatifsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const pieceJustificatifs: Type[] = pieceJustificatifsToCheck.filter(isPresent);
    if (pieceJustificatifs.length > 0) {
      const pieceJustificatifCollectionIdentifiers = pieceJustificatifCollection.map(
        pieceJustificatifItem => this.getPieceJustificatifIdentifier(pieceJustificatifItem)!,
      );
      const pieceJustificatifsToAdd = pieceJustificatifs.filter(pieceJustificatifItem => {
        const pieceJustificatifIdentifier = this.getPieceJustificatifIdentifier(pieceJustificatifItem);
        if (pieceJustificatifCollectionIdentifiers.includes(pieceJustificatifIdentifier)) {
          return false;
        }
        pieceJustificatifCollectionIdentifiers.push(pieceJustificatifIdentifier);
        return true;
      });
      return [...pieceJustificatifsToAdd, ...pieceJustificatifCollection];
    }
    return pieceJustificatifCollection;
  }

  protected convertDateFromClient<T extends IPieceJustificatif | NewPieceJustificatif | PartialUpdatePieceJustificatif>(
    pieceJustificatif: T,
  ): RestOf<T> {
    return {
      ...pieceJustificatif,
      dateHeureModification: pieceJustificatif.dateHeureModification?.toJSON() ?? null,
      dateHeureCreation: pieceJustificatif.dateHeureCreation?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restPieceJustificatif: RestPieceJustificatif): IPieceJustificatif {
    return {
      ...restPieceJustificatif,
      dateHeureModification: restPieceJustificatif.dateHeureModification ? dayjs(restPieceJustificatif.dateHeureModification) : undefined,
      dateHeureCreation: restPieceJustificatif.dateHeureCreation ? dayjs(restPieceJustificatif.dateHeureCreation) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestPieceJustificatif>): HttpResponse<IPieceJustificatif> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestPieceJustificatif[]>): HttpResponse<IPieceJustificatif[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
