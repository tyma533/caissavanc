import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ITypeOperation } from '../type-operation.model';
import { TypeOperationService } from '../service/type-operation.service';

@Component({
  standalone: true,
  templateUrl: './type-operation-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class TypeOperationDeleteDialogComponent {
  typeOperation?: ITypeOperation;

  constructor(
    protected typeOperationService: TypeOperationService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.typeOperationService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
