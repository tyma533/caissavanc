import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IGerantCaisse } from '../gerant-caisse.model';
import { GerantCaisseService } from '../service/gerant-caisse.service';

@Component({
  standalone: true,
  templateUrl: './gerant-caisse-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class GerantCaisseDeleteDialogComponent {
  gerantCaisse?: IGerantCaisse;

  constructor(
    protected gerantCaisseService: GerantCaisseService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.gerantCaisseService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
