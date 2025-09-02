import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IModeOperation, NewModeOperation } from '../mode-operation.model';

export type PartialUpdateModeOperation = Partial<IModeOperation> & Pick<IModeOperation, 'id'>;

type RestOf<T extends IModeOperation | NewModeOperation> = Omit<T, 'dateHeureModification' | 'dateHeureCreation'> & {
  dateHeureModification?: string | null;
  dateHeureCreation?: string | null;
};

export type RestModeOperation = RestOf<IModeOperation>;

export type NewRestModeOperation = RestOf<NewModeOperation>;

export type PartialUpdateRestModeOperation = RestOf<PartialUpdateModeOperation>;

export type EntityResponseType = HttpResponse<IModeOperation>;
export type EntityArrayResponseType = HttpResponse<IModeOperation[]>;

@Injectable({ providedIn: 'root' })
export class ModeOperationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/mode-operations');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(modeOperation: NewModeOperation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(modeOperation);
    return this.http
      .post<RestModeOperation>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(modeOperation: IModeOperation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(modeOperation);
    return this.http
      .put<RestModeOperation>(`${this.resourceUrl}/${this.getModeOperationIdentifier(modeOperation)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(modeOperation: PartialUpdateModeOperation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(modeOperation);
    return this.http
      .patch<RestModeOperation>(`${this.resourceUrl}/${this.getModeOperationIdentifier(modeOperation)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestModeOperation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestModeOperation[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getModeOperationIdentifier(modeOperation: Pick<IModeOperation, 'id'>): number {
    return modeOperation.id;
  }

  compareModeOperation(o1: Pick<IModeOperation, 'id'> | null, o2: Pick<IModeOperation, 'id'> | null): boolean {
    return o1 && o2 ? this.getModeOperationIdentifier(o1) === this.getModeOperationIdentifier(o2) : o1 === o2;
  }

  addModeOperationToCollectionIfMissing<Type extends Pick<IModeOperation, 'id'>>(
    modeOperationCollection: Type[],
    ...modeOperationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const modeOperations: Type[] = modeOperationsToCheck.filter(isPresent);
    if (modeOperations.length > 0) {
      const modeOperationCollectionIdentifiers = modeOperationCollection.map(
        modeOperationItem => this.getModeOperationIdentifier(modeOperationItem)!,
      );
      const modeOperationsToAdd = modeOperations.filter(modeOperationItem => {
        const modeOperationIdentifier = this.getModeOperationIdentifier(modeOperationItem);
        if (modeOperationCollectionIdentifiers.includes(modeOperationIdentifier)) {
          return false;
        }
        modeOperationCollectionIdentifiers.push(modeOperationIdentifier);
        return true;
      });
      return [...modeOperationsToAdd, ...modeOperationCollection];
    }
    return modeOperationCollection;
  }

  protected convertDateFromClient<T extends IModeOperation | NewModeOperation | PartialUpdateModeOperation>(modeOperation: T): RestOf<T> {
    return {
      ...modeOperation,
      dateHeureModification: modeOperation.dateHeureModification?.toJSON() ?? null,
      dateHeureCreation: modeOperation.dateHeureCreation?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restModeOperation: RestModeOperation): IModeOperation {
    return {
      ...restModeOperation,
      dateHeureModification: restModeOperation.dateHeureModification ? dayjs(restModeOperation.dateHeureModification) : undefined,
      dateHeureCreation: restModeOperation.dateHeureCreation ? dayjs(restModeOperation.dateHeureCreation) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestModeOperation>): HttpResponse<IModeOperation> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestModeOperation[]>): HttpResponse<IModeOperation[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
