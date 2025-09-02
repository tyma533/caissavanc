import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ICaisse } from '../caisse.model';
import { CaisseService } from '../service/caisse.service';

@Component({
  standalone: true,
  templateUrl: './caisse-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class CaisseDeleteDialogComponent {
  caisse?: ICaisse;

  constructor(
    protected caisseService: CaisseService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.caisseService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
