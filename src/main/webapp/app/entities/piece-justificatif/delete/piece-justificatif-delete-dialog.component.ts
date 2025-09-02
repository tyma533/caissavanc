import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IPieceJustificatif } from '../piece-justificatif.model';
import { PieceJustificatifService } from '../service/piece-justificatif.service';

@Component({
  standalone: true,
  templateUrl: './piece-justificatif-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class PieceJustificatifDeleteDialogComponent {
  pieceJustificatif?: IPieceJustificatif;

  constructor(
    protected pieceJustificatifService: PieceJustificatifService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.pieceJustificatifService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
