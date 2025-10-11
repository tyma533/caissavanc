import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import SharedModule from 'app/shared/shared.module';
import { CaisseService } from '../service/caisse.service';
import { DemandeService } from 'app/entities/demande/service/demande.service';

@Component({
  selector: 'jhi-demande-caisse',
  templateUrl: './demande-caisse.component.html',
  styleUrls: ['./demande-caisse.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, SharedModule, FontAwesomeModule],
})
export class DemandeCaisseComponent {
  constructor(
    private route: ActivatedRoute,
    private caisseService: CaisseService,
    private demandeService: DemandeService,
  ) {}
}
