import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IAgentEtatProfil } from '../agent-etat-profil.model';
import { AgentEtatProfilService } from '../service/agent-etat-profil.service';

@Component({
  standalone: true,
  templateUrl: './agent-etat-profil-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class AgentEtatProfilDeleteDialogComponent {
  agentEtatProfil?: IAgentEtatProfil;

  constructor(
    protected agentEtatProfilService: AgentEtatProfilService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.agentEtatProfilService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
