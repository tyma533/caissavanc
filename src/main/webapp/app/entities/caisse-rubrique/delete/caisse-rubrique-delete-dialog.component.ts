import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ICaisseRubrique } from '../caisse-rubrique.model';
import { CaisseRubriqueService } from '../service/caisse-rubrique.service';

@Component({
  standalone: true,
  templateUrl: './caisse-rubrique-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class CaisseRubriqueDeleteDialogComponent {
  caisseRubrique?: ICaisseRubrique;

  constructor(
    protected caisseRubriqueService: CaisseRubriqueService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.caisseRubriqueService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
