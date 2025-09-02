import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IGerant } from '../gerant.model';
import { GerantService } from '../service/gerant.service';

@Component({
  standalone: true,
  templateUrl: './gerant-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class GerantDeleteDialogComponent {
  gerant?: IGerant;

  constructor(
    protected gerantService: GerantService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.gerantService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
