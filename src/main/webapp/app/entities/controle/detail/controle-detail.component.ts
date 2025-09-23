import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IControle } from '../controle.model';

@Component({
  standalone: true,
  selector: 'jhi-controle-detail',
  templateUrl: './controle-detail.component.html',
  styleUrls: ['./controle-detail.component.scss'],
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class ControleDetailComponent {
  @Input() controle: IControle | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  previousState(): void {
    window.history.back();
  }
}
