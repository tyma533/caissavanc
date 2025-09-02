import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEtatOperation, NewEtatOperation } from '../etat-operation.model';

export type PartialUpdateEtatOperation = Partial<IEtatOperation> & Pick<IEtatOperation, 'id'>;

type RestOf<T extends IEtatOperation | NewEtatOperation> = Omit<T, 'dateHeureModification' | 'dateHeureCreation'> & {
  dateHeureModification?: string | null;
  dateHeureCreation?: string | null;
};

export type RestEtatOperation = RestOf<IEtatOperation>;

export type NewRestEtatOperation = RestOf<NewEtatOperation>;

export type PartialUpdateRestEtatOperation = RestOf<PartialUpdateEtatOperation>;

export type EntityResponseType = HttpResponse<IEtatOperation>;
export type EntityArrayResponseType = HttpResponse<IEtatOperation[]>;

@Injectable({ providedIn: 'root' })
export class EtatOperationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/etat-operations');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(etatOperation: NewEtatOperation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(etatOperation);
    return this.http
      .post<RestEtatOperation>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(etatOperation: IEtatOperation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(etatOperation);
    return this.http
      .put<RestEtatOperation>(`${this.resourceUrl}/${this.getEtatOperationIdentifier(etatOperation)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(etatOperation: PartialUpdateEtatOperation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(etatOperation);
    return this.http
      .patch<RestEtatOperation>(`${this.resourceUrl}/${this.getEtatOperationIdentifier(etatOperation)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestEtatOperation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestEtatOperation[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEtatOperationIdentifier(etatOperation: Pick<IEtatOperation, 'id'>): number {
    return etatOperation.id;
  }

  compareEtatOperation(o1: Pick<IEtatOperation, 'id'> | null, o2: Pick<IEtatOperation, 'id'> | null): boolean {
    return o1 && o2 ? this.getEtatOperationIdentifier(o1) === this.getEtatOperationIdentifier(o2) : o1 === o2;
  }

  addEtatOperationToCollectionIfMissing<Type extends Pick<IEtatOperation, 'id'>>(
    etatOperationCollection: Type[],
    ...etatOperationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const etatOperations: Type[] = etatOperationsToCheck.filter(isPresent);
    if (etatOperations.length > 0) {
      const etatOperationCollectionIdentifiers = etatOperationCollection.map(
        etatOperationItem => this.getEtatOperationIdentifier(etatOperationItem)!,
      );
      const etatOperationsToAdd = etatOperations.filter(etatOperationItem => {
        const etatOperationIdentifier = this.getEtatOperationIdentifier(etatOperationItem);
        if (etatOperationCollectionIdentifiers.includes(etatOperationIdentifier)) {
          return false;
        }
        etatOperationCollectionIdentifiers.push(etatOperationIdentifier);
        return true;
      });
      return [...etatOperationsToAdd, ...etatOperationCollection];
    }
    return etatOperationCollection;
  }

  protected convertDateFromClient<T extends IEtatOperation | NewEtatOperation | PartialUpdateEtatOperation>(etatOperation: T): RestOf<T> {
    return {
      ...etatOperation,
      dateHeureModification: etatOperation.dateHeureModification?.toJSON() ?? null,
      dateHeureCreation: etatOperation.dateHeureCreation?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restEtatOperation: RestEtatOperation): IEtatOperation {
    return {
      ...restEtatOperation,
      dateHeureModification: restEtatOperation.dateHeureModification ? dayjs(restEtatOperation.dateHeureModification) : undefined,
      dateHeureCreation: restEtatOperation.dateHeureCreation ? dayjs(restEtatOperation.dateHeureCreation) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestEtatOperation>): HttpResponse<IEtatOperation> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestEtatOperation[]>): HttpResponse<IEtatOperation[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
