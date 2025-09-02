import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IControle } from '../controle.model';
import { ControleService } from '../service/controle.service';

@Component({
  standalone: true,
  templateUrl: './controle-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ControleDeleteDialogComponent {
  controle?: IControle;

  constructor(
    protected controleService: ControleService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.controleService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
