import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITypeOperation, NewTypeOperation } from '../type-operation.model';

export type PartialUpdateTypeOperation = Partial<ITypeOperation> & Pick<ITypeOperation, 'id'>;

type RestOf<T extends ITypeOperation | NewTypeOperation> = Omit<T, 'dateHeureModification' | 'dateHeureCreation'> & {
  dateHeureModification?: string | null;
  dateHeureCreation?: string | null;
};

export type RestTypeOperation = RestOf<ITypeOperation>;

export type NewRestTypeOperation = RestOf<NewTypeOperation>;

export type PartialUpdateRestTypeOperation = RestOf<PartialUpdateTypeOperation>;

export type EntityResponseType = HttpResponse<ITypeOperation>;
export type EntityArrayResponseType = HttpResponse<ITypeOperation[]>;

@Injectable({ providedIn: 'root' })
export class TypeOperationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/type-operations');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(typeOperation: NewTypeOperation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(typeOperation);
    return this.http
      .post<RestTypeOperation>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(typeOperation: ITypeOperation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(typeOperation);
    return this.http
      .put<RestTypeOperation>(`${this.resourceUrl}/${this.getTypeOperationIdentifier(typeOperation)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(typeOperation: PartialUpdateTypeOperation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(typeOperation);
    return this.http
      .patch<RestTypeOperation>(`${this.resourceUrl}/${this.getTypeOperationIdentifier(typeOperation)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestTypeOperation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestTypeOperation[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTypeOperationIdentifier(typeOperation: Pick<ITypeOperation, 'id'>): number {
    return typeOperation.id;
  }

  compareTypeOperation(o1: Pick<ITypeOperation, 'id'> | null, o2: Pick<ITypeOperation, 'id'> | null): boolean {
    return o1 && o2 ? this.getTypeOperationIdentifier(o1) === this.getTypeOperationIdentifier(o2) : o1 === o2;
  }

  addTypeOperationToCollectionIfMissing<Type extends Pick<ITypeOperation, 'id'>>(
    typeOperationCollection: Type[],
    ...typeOperationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const typeOperations: Type[] = typeOperationsToCheck.filter(isPresent);
    if (typeOperations.length > 0) {
      const typeOperationCollectionIdentifiers = typeOperationCollection.map(
        typeOperationItem => this.getTypeOperationIdentifier(typeOperationItem)!,
      );
      const typeOperationsToAdd = typeOperations.filter(typeOperationItem => {
        const typeOperationIdentifier = this.getTypeOperationIdentifier(typeOperationItem);
        if (typeOperationCollectionIdentifiers.includes(typeOperationIdentifier)) {
          return false;
        }
        typeOperationCollectionIdentifiers.push(typeOperationIdentifier);
        return true;
      });
      return [...typeOperationsToAdd, ...typeOperationCollection];
    }
    return typeOperationCollection;
  }

  protected convertDateFromClient<T extends ITypeOperation | NewTypeOperation | PartialUpdateTypeOperation>(typeOperation: T): RestOf<T> {
    return {
      ...typeOperation,
      dateHeureModification: typeOperation.dateHeureModification?.toJSON() ?? null,
      dateHeureCreation: typeOperation.dateHeureCreation?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restTypeOperation: RestTypeOperation): ITypeOperation {
    return {
      ...restTypeOperation,
      dateHeureModification: restTypeOperation.dateHeureModification ? dayjs(restTypeOperation.dateHeureModification) : undefined,
      dateHeureCreation: restTypeOperation.dateHeureCreation ? dayjs(restTypeOperation.dateHeureCreation) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestTypeOperation>): HttpResponse<ITypeOperation> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestTypeOperation[]>): HttpResponse<ITypeOperation[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
