jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ModeOperationService } from '../service/mode-operation.service';

import { ModeOperationDeleteDialogComponent } from './mode-operation-delete-dialog.component';

describe('ModeOperation Management Delete Component', () => {
  let comp: ModeOperationDeleteDialogComponent;
  let fixture: ComponentFixture<ModeOperationDeleteDialogComponent>;
  let service: ModeOperationService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ModeOperationDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(ModeOperationDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ModeOperationDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ModeOperationService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {
    it('Should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({ body: {} })));

        // WHEN
        comp.confirmDelete(123);
        tick();

        // THEN
        expect(service.delete).toHaveBeenCalledWith(123);
        expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
      }),
    ));

    it('Should not call delete service on clear', () => {
      // GIVEN
      jest.spyOn(service, 'delete');

      // WHEN
      comp.cancel();

      // THEN
      expect(service.delete).not.toHaveBeenCalled();
      expect(mockActiveModal.close).not.toHaveBeenCalled();
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
