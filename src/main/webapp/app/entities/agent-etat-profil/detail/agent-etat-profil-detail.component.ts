import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IAgentEtatProfil } from '../agent-etat-profil.model';

@Component({
  standalone: true,
  selector: 'jhi-agent-etat-profil-detail',
  templateUrl: './agent-etat-profil-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class AgentEtatProfilDetailComponent {
  @Input() agentEtatProfil: IAgentEtatProfil | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  previousState(): void {
    window.history.back();
  }
}
