import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { SortDirective, SortByDirective } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { SortService } from 'app/shared/sort/sort.service';
import { IDemande } from '../demande.model';
import { EntityArrayResponseType, DemandeService } from '../service/demande.service';
import { DemandeDeleteDialogComponent } from '../delete/demande-delete-dialog.component';
import { EnumTypeLabels } from 'app/entities/enumerations/type.model';
import { DemandeMotifComponent } from '../demande-motif/demande-motif.component';
import { ETATEN_ATTENTE, ETATEXECUTEE, ETATREFUSEE, ETATVALIDEE } from 'app/app.constants';

@Component({
  standalone: true,
  selector: 'jhi-demande',
  templateUrl: './demande.component.html',
  styleUrls: ['./demande.component.scss'],
  imports: [
    RouterModule,
    FormsModule,
    SharedModule,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    ReactiveFormsModule,
  ],
})
export class DemandeComponent implements OnInit {
  demandes?: IDemande[];
  isLoading = false;
  tranchesSharedCollection: IDemande[] = [];
  predicate = 'id';
  ascending = true;
  EnumTypeLabels = EnumTypeLabels;
  ETATVALIDEE = ETATVALIDEE;
  ETATREFUSEE = ETATREFUSEE;
  ETATEXECUTEE = ETATEXECUTEE;
  ETATEN_ATTENTE = ETATEN_ATTENTE;

  filter = new FormControl('', { nonNullable: true });

  page = 1;
  pageSize = 10;
  collectionSize = 0;
  constructor(
    protected demandeService: DemandeService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal,
  ) {}

  trackId = (_index: number, item: IDemande): number => this.demandeService.getDemandeIdentifier(item);

  ngOnInit(): void {
    this.load();
    this.filter.valueChanges.subscribe(() => {
      this.applyFilterAndSort();
    });
  }
  applyFilterAndSort(): void {
    let filteredDemandes: IDemande[];

    const term = this.filter.value.toLowerCase();
    if (term) {
      filteredDemandes = this.tranchesSharedCollection.filter(t => t.etablissement?.libelle?.toLowerCase().includes(term));
    } else {
      filteredDemandes = [...this.tranchesSharedCollection];
    }

    const sortedRubriques = this.refineData(filteredDemandes);
    this.collectionSize = sortedRubriques.length;
    this.demandes = sortedRubriques.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  delete(demande: IDemande): void {
    const modalRef = this.modalService.open(DemandeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.demande = demande;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformations()),
      )
      .subscribe({
        next: (res: EntityArrayResponseType) => {
          this.onResponseSuccess(res);
        },
      });
  }

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.predicate, this.ascending);
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.predicate, this.ascending)),
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  // protected onResponseSuccess(response: EntityArrayResponseType): void {
  //   const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
  //   this.demandes = this.refineData(dataFromBody);
  // }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    this.tranchesSharedCollection = this.fillComponentAttributesFromResponseBody(response.body);
    console.log(this.tranchesSharedCollection);
    this.applyFilterAndSort();
  }

  protected refineData(data: IDemande[]): IDemande[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: IDemande[] | null): IDemande[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.demandeService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      sort: this.getSortQueryParam(predicate, ascending),
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }
  protected openMotif(motif: string) {
    const modalRef = this.modalService.open(DemandeMotifComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.motif = motif;
  }
}
