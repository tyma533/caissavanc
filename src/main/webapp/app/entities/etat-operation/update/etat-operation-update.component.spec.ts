import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EtatOperationService } from '../service/etat-operation.service';
import { IEtatOperation } from '../etat-operation.model';
import { EtatOperationFormService } from './etat-operation-form.service';

import { EtatOperationUpdateComponent } from './etat-operation-update.component';

describe('EtatOperation Management Update Component', () => {
  let comp: EtatOperationUpdateComponent;
  let fixture: ComponentFixture<EtatOperationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let etatOperationFormService: EtatOperationFormService;
  let etatOperationService: EtatOperationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), EtatOperationUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(EtatOperationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EtatOperationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    etatOperationFormService = TestBed.inject(EtatOperationFormService);
    etatOperationService = TestBed.inject(EtatOperationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const etatOperation: IEtatOperation = { id: 456 };

      activatedRoute.data = of({ etatOperation });
      comp.ngOnInit();

      expect(comp.etatOperation).toEqual(etatOperation);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEtatOperation>>();
      const etatOperation = { id: 123 };
      jest.spyOn(etatOperationFormService, 'getEtatOperation').mockReturnValue(etatOperation);
      jest.spyOn(etatOperationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ etatOperation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: etatOperation }));
      saveSubject.complete();

      // THEN
      expect(etatOperationFormService.getEtatOperation).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(etatOperationService.update).toHaveBeenCalledWith(expect.objectContaining(etatOperation));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEtatOperation>>();
      const etatOperation = { id: 123 };
      jest.spyOn(etatOperationFormService, 'getEtatOperation').mockReturnValue({ id: null });
      jest.spyOn(etatOperationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ etatOperation: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: etatOperation }));
      saveSubject.complete();

      // THEN
      expect(etatOperationFormService.getEtatOperation).toHaveBeenCalled();
      expect(etatOperationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEtatOperation>>();
      const etatOperation = { id: 123 };
      jest.spyOn(etatOperationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ etatOperation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(etatOperationService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
