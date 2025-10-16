import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { ICaisse } from 'app/entities/caisse/caisse.model';
import { CaisseService } from 'app/entities/caisse/service/caisse.service';

@Component({
  standalone: true,
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [SharedModule, RouterModule],
})
export default class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  caisses: ICaisse[] = [];
  soldeTotal: number = 0;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private accountService: AccountService,
    private router: Router,
    private caisseService: CaisseService,
  ) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));
    this.loadCaisses();
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  getTotalSolde(): number {
    return this.caisses?.reduce((total, c) => total + (c.solde || 0), 0) ?? 0;
  }
  loadCaisses(): void {
    this.caisseService.query().subscribe({
      next: res => {
        this.caisses = res.body ?? [];
        this.calculateSoldeTotal();
      },
      error: err => {
        console.error('Erreur lors du chargement des caisses', err);
      },
    });
  }

  calculateSoldeTotal(): void {
    this.soldeTotal = this.caisses.reduce((sum, c) => sum + (c.solde ?? 0), 0);
  }
}
