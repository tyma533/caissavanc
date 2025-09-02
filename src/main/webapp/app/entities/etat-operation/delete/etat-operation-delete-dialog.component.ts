import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IEtatOperation } from '../etat-operation.model';
import { EtatOperationService } from '../service/etat-operation.service';

@Component({
  standalone: true,
  templateUrl: './etat-operation-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class EtatOperationDeleteDialogComponent {
  etatOperation?: IEtatOperation;

  constructor(
    protected etatOperationService: EtatOperationService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.etatOperationService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
