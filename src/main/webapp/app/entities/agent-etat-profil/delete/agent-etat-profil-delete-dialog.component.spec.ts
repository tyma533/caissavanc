jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AgentEtatProfilService } from '../service/agent-etat-profil.service';

import { AgentEtatProfilDeleteDialogComponent } from './agent-etat-profil-delete-dialog.component';

describe('AgentEtatProfil Management Delete Component', () => {
  let comp: AgentEtatProfilDeleteDialogComponent;
  let fixture: ComponentFixture<AgentEtatProfilDeleteDialogComponent>;
  let service: AgentEtatProfilService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AgentEtatProfilDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(AgentEtatProfilDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AgentEtatProfilDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AgentEtatProfilService);
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
