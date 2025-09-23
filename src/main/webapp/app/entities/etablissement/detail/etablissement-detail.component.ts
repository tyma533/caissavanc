import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IEtablissement } from '../etablissement.model';

@Component({
  standalone: true,
  selector: 'jhi-etablissement-detail',
  templateUrl: './etablissement-detail.component.html',
  styleUrls: ['./etablissement-detail.component.scss'],
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class EtablissementDetailComponent {
  @Input() etablissement: IEtablissement | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  previousState(): void {
    window.history.back();
  }
}
