import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import SharedModule from 'app/shared/shared.module';
import { CaisseService } from '../service/caisse.service';
import { DemandeService } from 'app/entities/demande/service/demande.service';
import { IDemande } from 'app/entities/demande/demande.model';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ETATEN_ATTENTE, ETATEXECUTEE, ETATREFUSEE, ETATVALIDEE } from 'app/app.constants';
import { ICaisse } from '../caisse.model';
import { Dayjs } from 'dayjs';

@Component({
  selector: 'jhi-demande-caisse',
  templateUrl: './demande-caisse.component.html',
  styleUrls: ['./demande-caisse.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, SharedModule, FontAwesomeModule],
})
export class DemandeCaisseComponent {
  demandes: IDemande[] = [];
  caisseId?: number;
  caisse?: ICaisse | null;
  isLoading = false;
  ETATVALIDEE = ETATVALIDEE;
  ETATREFUSEE = ETATREFUSEE;
  ETATEXECUTEE = ETATEXECUTEE;
  ETATEN_ATTENTE = ETATEN_ATTENTE;

  constructor(
    private demandeService: DemandeService,
    private route: ActivatedRoute,
    private router: Router,
    private caisseService: CaisseService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadCaisse(id);
    }
  }

  loadCaisse(id: number): void {
    this.caisseService.find(id).subscribe({
      next: res => {
        this.caisse = res.body ?? undefined;
        if (this.caisse?.id) {
          this.loadDemandes(this.caisse.id);
        }
      },
      error: () => {
        this.caisse = undefined;
      },
    });
  }

  loadDemandes(caisseId: number): void {
    this.isLoading = true;
    this.demandeService.findByCaisseAlimentations(caisseId).subscribe({
      next: (res: HttpResponse<IDemande[]>) => {
        this.demandes = res.body ?? [];
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }

  // loadAll(): void {
  //   this.isLoading = true;
  //   if (this.caisseId) {
  //     this.demandeService
  //       .findByCaisseAndType(this.caisseId, 'ALIMENTATION_CAISSE')
  //       .subscribe({
  //         next: (res: HttpResponse<IDemande[]>) => {
  //           this.demandes = res.body ?? [];
  //           this.isLoading = false;
  //         },
  //         error: () => (this.isLoading = false),
  //       });
  //   }
  // }

  trackId(index: number, item: IDemande): number {
    return item.id!;
  }

  previousState(): void {
    window.history.back();
  }
}
