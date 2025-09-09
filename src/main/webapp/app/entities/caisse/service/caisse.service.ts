import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICaisse, NewCaisse } from '../caisse.model';
import { IRubrique } from 'app/entities/rubrique/rubrique.model';
import { ICaisseRubrique } from 'app/entities/caisse-rubrique/caisse-rubrique.model';

export type PartialUpdateCaisse = Partial<ICaisse> & Pick<ICaisse, 'id'>;

type RestOf<T extends ICaisse | NewCaisse> = Omit<
  T,
  'dateCreationCaisse' | 'dateFermiture' | 'dateHeureModification' | 'dateHeureCreation'
> & {
  dateCreationCaisse?: string | null;
  dateFermiture?: string | null;
  dateHeureModification?: string | null;
  dateHeureCreation?: string | null;
};

export type RestCaisse = RestOf<ICaisse>;

export type NewRestCaisse = RestOf<NewCaisse>;

export type PartialUpdateRestCaisse = RestOf<PartialUpdateCaisse>;

export type EntityResponseType = HttpResponse<ICaisse>;
export type EntityArrayResponseType = HttpResponse<ICaisse[]>;

@Injectable({ providedIn: 'root' })
export class CaisseService {
  // getCaisse(caisseId: number) {
  //   throw new Error('Method not implemented.');
  // }
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/caisses');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(caisse: NewCaisse): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(caisse);
    return this.http
      .post<RestCaisse>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(caisse: ICaisse): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(caisse);
    return this.http
      .put<RestCaisse>(`${this.resourceUrl}/${this.getCaisseIdentifier(caisse)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(caisse: PartialUpdateCaisse): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(caisse);
    return this.http
      .patch<RestCaisse>(`${this.resourceUrl}/${this.getCaisseIdentifier(caisse)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestCaisse>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestCaisse[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCaisseIdentifier(caisse: Pick<ICaisse, 'id'>): number {
    return caisse.id;
  }

  compareCaisse(o1: Pick<ICaisse, 'id'> | null, o2: Pick<ICaisse, 'id'> | null): boolean {
    return o1 && o2 ? this.getCaisseIdentifier(o1) === this.getCaisseIdentifier(o2) : o1 === o2;
  }

  addCaisseToCollectionIfMissing<Type extends Pick<ICaisse, 'id'>>(
    caisseCollection: Type[],
    ...caissesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const caisses: Type[] = caissesToCheck.filter(isPresent);
    if (caisses.length > 0) {
      const caisseCollectionIdentifiers = caisseCollection.map(caisseItem => this.getCaisseIdentifier(caisseItem)!);
      const caissesToAdd = caisses.filter(caisseItem => {
        const caisseIdentifier = this.getCaisseIdentifier(caisseItem);
        if (caisseCollectionIdentifiers.includes(caisseIdentifier)) {
          return false;
        }
        caisseCollectionIdentifiers.push(caisseIdentifier);
        return true;
      });
      return [...caissesToAdd, ...caisseCollection];
    }
    return caisseCollection;
  }

  protected convertDateFromClient<T extends ICaisse | NewCaisse | PartialUpdateCaisse>(caisse: T): RestOf<T> {
    return {
      ...caisse,
      dateCreationCaisse: caisse.dateCreationCaisse?.toJSON() ?? null,
      dateFermiture: caisse.dateFermiture?.toJSON() ?? null,
      dateHeureModification: caisse.dateHeureModification?.toJSON() ?? null,
      dateHeureCreation: caisse.dateHeureCreation?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restCaisse: RestCaisse): ICaisse {
    return {
      ...restCaisse,
      dateCreationCaisse: restCaisse.dateCreationCaisse ? dayjs(restCaisse.dateCreationCaisse) : undefined,
      dateFermiture: restCaisse.dateFermiture ? dayjs(restCaisse.dateFermiture) : undefined,
      dateHeureModification: restCaisse.dateHeureModification ? dayjs(restCaisse.dateHeureModification) : undefined,
      dateHeureCreation: restCaisse.dateHeureCreation ? dayjs(restCaisse.dateHeureCreation) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestCaisse>): HttpResponse<ICaisse> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestCaisse[]>): HttpResponse<ICaisse[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }

  getCaisse(id: number): Observable<ICaisse> {
    return this.http.get<ICaisse>(`${this.resourceUrl}/${id}`);
  }
  getRubriquesAffectees(caisseId: number): Observable<IRubrique[]> {
    return this.http.get<IRubrique[]>(`${this.resourceUrl}/${caisseId}/rubriques/affectees`);
  }

  getRubriquesNonAffectees(caisseId: number): Observable<IRubrique[]> {
    return this.http.get<IRubrique[]>(`${this.resourceUrl}/${caisseId}/rubriques/non-affectees`);
  }

  // affecterRubrique(caisseId: number, rubriqueId: number): Observable<any> {
  //   return this.http.post(`${this.resourceUrl}/${caisseId}/affecter/${rubriqueId}`, {});
  // }

  affecterRubrique(caisseId: number, rubriqueId: number): Observable<ICaisseRubrique> {
    return this.http.post<ICaisseRubrique>(
      `${this.resourceUrl}/${caisseId}/affecter/${rubriqueId}`,
      {}, // corps vide car tout est dans l'URL
    );
  }

  desaffecterRubrique(caisseId: number, rubriqueId: number): Observable<any> {
    return this.http.post(`${this.resourceUrl}/${caisseId}/desaffecter/${rubriqueId}`, {});
  }
}
