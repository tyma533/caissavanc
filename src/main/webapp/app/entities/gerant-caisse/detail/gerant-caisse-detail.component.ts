import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IGerantCaisse } from '../gerant-caisse.model';

@Component({
  standalone: true,
  selector: 'jhi-gerant-caisse-detail',
  templateUrl: './gerant-caisse-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class GerantCaisseDetailComponent {
  @Input() gerantCaisse: IGerantCaisse | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  previousState(): void {
    window.history.back();
  }
}
