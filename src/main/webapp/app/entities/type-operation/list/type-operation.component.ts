import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { SortDirective, SortByDirective } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { SortService } from 'app/shared/sort/sort.service';
import { ITypeOperation } from '../type-operation.model';
import { EntityArrayResponseType, TypeOperationService } from '../service/type-operation.service';
import { TypeOperationDeleteDialogComponent } from '../delete/type-operation-delete-dialog.component';

@Component({
  standalone: true,
  selector: 'jhi-type-operation',
  templateUrl: './type-operation.component.html',
  styleUrls: ['./type-operation.component.scss'],
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
export class TypeOperationComponent implements OnInit {
  typeOperations?: ITypeOperation[];
  isLoading = false;
  tranchesSharedCollection: ITypeOperation[] = [];
  predicate = 'id';
  ascending = true;

  filter = new FormControl('', { nonNullable: true });

  page = 1;
  pageSize = 10;
  collectionSize = 0;

  constructor(
    protected typeOperationService: TypeOperationService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal,
  ) {}

  trackId = (_index: number, item: ITypeOperation): number => this.typeOperationService.getTypeOperationIdentifier(item);

  ngOnInit(): void {
    this.load();
    this.filter.valueChanges.subscribe(() => {
      this.applyFilterAndSort();
    });
  }
  applyFilterAndSort(): void {
    let filteredTypeOperations: ITypeOperation[];

    const term = this.filter.value.toLowerCase();
    if (term) {
      filteredTypeOperations = this.tranchesSharedCollection.filter(t => t.libelle?.toLowerCase().includes(term));
    } else {
      filteredTypeOperations = [...this.tranchesSharedCollection];
    }

    const sortedTypeOperations = this.refineData(filteredTypeOperations);
    this.collectionSize = sortedTypeOperations.length;
    this.typeOperations = sortedTypeOperations.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  delete(typeOperation: ITypeOperation): void {
    const modalRef = this.modalService.open(TypeOperationDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.typeOperation = typeOperation;
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
  //   this.typeOperations = this.refineData(dataFromBody);
  // }
  protected onResponseSuccess(response: EntityArrayResponseType): void {
    this.tranchesSharedCollection = this.fillComponentAttributesFromResponseBody(response.body);
    this.applyFilterAndSort();
  }

  protected refineData(data: ITypeOperation[]): ITypeOperation[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: ITypeOperation[] | null): ITypeOperation[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.typeOperationService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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
