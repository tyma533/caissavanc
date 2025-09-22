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
import { ICaisseRubrique } from '../caisse-rubrique.model';
import { EntityArrayResponseType, CaisseRubriqueService } from '../service/caisse-rubrique.service';
import { CaisseRubriqueDeleteDialogComponent } from '../delete/caisse-rubrique-delete-dialog.component';

@Component({
  standalone: true,
  selector: 'jhi-caisse-rubrique',
  templateUrl: './caisse-rubrique.component.html',
  styleUrls: ['./caisse-rubrique.component.scss'],
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
export class CaisseRubriqueComponent implements OnInit {
  caisseRubriques?: ICaisseRubrique[];
  isLoading = false;
  tranchesSharedCollection: ICaisseRubrique[] = [];
  predicate = 'id';
  ascending = true;
  filter = new FormControl('', { nonNullable: true });

  page = 1;
  pageSize = 10;
  collectionSize = 0;

  constructor(
    protected caisseRubriqueService: CaisseRubriqueService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal,
  ) {}

  trackId = (_index: number, item: ICaisseRubrique): number => this.caisseRubriqueService.getCaisseRubriqueIdentifier(item);

  ngOnInit(): void {
    this.load();
    this.filter.valueChanges.subscribe(() => {
      this.applyFilterAndSort();
    });
  }

  applyFilterAndSort(): void {
    let filteredCaisseRubriques: ICaisseRubrique[];

    const term = this.filter.value.toLowerCase();
    if (term) {
      filteredCaisseRubriques = this.tranchesSharedCollection.filter(t => String(t.id).toLowerCase().includes(term));
    } else {
      filteredCaisseRubriques = [...this.tranchesSharedCollection];
    }

    const sortedCaisseRubriques = this.refineData(filteredCaisseRubriques);
    this.collectionSize = sortedCaisseRubriques.length;
    this.caisseRubriques = sortedCaisseRubriques.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  delete(caisseRubrique: ICaisseRubrique): void {
    const modalRef = this.modalService.open(CaisseRubriqueDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.caisseRubrique = caisseRubrique;
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
  //   this.caisseRubriques = this.refineData(dataFromBody);
  // }
  protected onResponseSuccess(response: EntityArrayResponseType): void {
    this.tranchesSharedCollection = this.fillComponentAttributesFromResponseBody(response.body);
    this.applyFilterAndSort();
  }

  protected refineData(data: ICaisseRubrique[]): ICaisseRubrique[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: ICaisseRubrique[] | null): ICaisseRubrique[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.caisseRubriqueService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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
}
