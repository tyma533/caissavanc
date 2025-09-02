import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IModeOperation } from '../mode-operation.model';
import { ModeOperationService } from '../service/mode-operation.service';

@Component({
  standalone: true,
  templateUrl: './mode-operation-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ModeOperationDeleteDialogComponent {
  modeOperation?: IModeOperation;

  constructor(
    protected modeOperationService: ModeOperationService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.modeOperationService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
