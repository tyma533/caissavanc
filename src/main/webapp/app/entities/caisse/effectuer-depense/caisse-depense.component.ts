import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICaisse } from '../caisse.model';
import { IOperation } from 'app/entities/operation/operation.model';
import { CaisseService } from '../service/caisse.service';
import { OperationService } from 'app/entities/operation/service/operation.service';
import SharedModule from 'app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-caisse-depense',
  templateUrl: './caisse-depense.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, SharedModule, FontAwesomeModule],
})
export class CaisseDepenseComponent implements OnInit {
  caisse: ICaisse | null = null;
  operations: IOperation[] = [];

  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private caisseService: CaisseService,
    private operationService: OperationService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadCaisseEtOperations(id);
    }
  }

  loadCaisseEtOperations(id: number): void {
    this.isLoading = true;
    this.caisseService.find(id).subscribe({
      next: caisseRes => {
        this.caisse = caisseRes.body ?? null;

        if (this.caisse?.id) {
          // 🔽 Utilise maintenant la méthode findDepensesByCaisse
          this.operationService.findDepensesByCaisse(this.caisse.id).subscribe({
            next: ops => {
              this.operations = ops;
              this.isLoading = false;
            },
            error: () => (this.isLoading = false),
          });
        }
      },
      error: () => (this.isLoading = false),
    });
  }

  previousState(): void {
    window.history.back();
  }
}
