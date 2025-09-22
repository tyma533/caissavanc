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
import { IAgentEtatProfil } from '../agent-etat-profil.model';
import { EntityArrayResponseType, AgentEtatProfilService } from '../service/agent-etat-profil.service';
import { AgentEtatProfilDeleteDialogComponent } from '../delete/agent-etat-profil-delete-dialog.component';

@Component({
  standalone: true,
  selector: 'jhi-agent-etat-profil',
  templateUrl: './agent-etat-profil.component.html',
  styleUrls: ['./agent-etat-profil.component.scss'],
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
export class AgentEtatProfilComponent implements OnInit {
  agentEtatProfils?: IAgentEtatProfil[];
  isLoading = false;
  tranchesSharedCollection: IAgentEtatProfil[] = [];
  predicate = 'id';
  ascending = true;

  filter = new FormControl('', { nonNullable: true });

  page = 1;
  pageSize = 10;
  collectionSize = 0;

  constructor(
    protected agentEtatProfilService: AgentEtatProfilService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal,
  ) {}

  trackId = (_index: number, item: IAgentEtatProfil): number => this.agentEtatProfilService.getAgentEtatProfilIdentifier(item);

  ngOnInit(): void {
    this.load();
    this.filter.valueChanges.subscribe(() => {
      this.applyFilterAndSort();
    });
  }

  applyFilterAndSort(): void {
    let filteredAgentEtatProfils: IAgentEtatProfil[];

    const term = this.filter.value.toLowerCase();
    if (term) {
      filteredAgentEtatProfils = this.tranchesSharedCollection.filter(
        t => t.id !== undefined && t.id.toString().toLowerCase().includes(term),
      );
    } else {
      filteredAgentEtatProfils = [...this.tranchesSharedCollection];
    }

    const sortedAgentEtatProfils = this.refineData(filteredAgentEtatProfils);
    this.collectionSize = sortedAgentEtatProfils.length;
    this.agentEtatProfils = sortedAgentEtatProfils.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
  delete(agentEtatProfil: IAgentEtatProfil): void {
    const modalRef = this.modalService.open(AgentEtatProfilDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.agentEtatProfil = agentEtatProfil;
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
  //   this.agentEtatProfils = this.refineData(dataFromBody);
  // }
  protected onResponseSuccess(response: EntityArrayResponseType): void {
    this.tranchesSharedCollection = this.fillComponentAttributesFromResponseBody(response.body);
    this.applyFilterAndSort();
  }

  protected refineData(data: IAgentEtatProfil[]): IAgentEtatProfil[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: IAgentEtatProfil[] | null): IAgentEtatProfil[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.agentEtatProfilService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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
