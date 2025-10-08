import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import SharedModule from 'app/shared/shared.module';

@Component({
  standalone: true,
  selector: 'jhi-demande-motif',
  templateUrl: './demande-motif.component.html',
  styleUrls: ['./demande-motif.component.scss'],
  imports: [SharedModule, FormsModule],
})
export class DemandeMotifComponent {
  motif?: string;
  constructor(protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }
}
