import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { ICaisseRubrique } from '../caisse-rubrique.model';

@Component({
  standalone: true,
  selector: 'jhi-caisse-rubrique-detail',
  templateUrl: './caisse-rubrique-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class CaisseRubriqueDetailComponent {
  @Input() caisseRubrique: ICaisseRubrique | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  previousState(): void {
    window.history.back();
  }
}
