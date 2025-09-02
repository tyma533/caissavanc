import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ModeOperationService } from '../service/mode-operation.service';
import { IModeOperation } from '../mode-operation.model';
import { ModeOperationFormService } from './mode-operation-form.service';

import { ModeOperationUpdateComponent } from './mode-operation-update.component';

describe('ModeOperation Management Update Component', () => {
  let comp: ModeOperationUpdateComponent;
  let fixture: ComponentFixture<ModeOperationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let modeOperationFormService: ModeOperationFormService;
  let modeOperationService: ModeOperationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ModeOperationUpdateComponent],
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
      .overrideTemplate(ModeOperationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ModeOperationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    modeOperationFormService = TestBed.inject(ModeOperationFormService);
    modeOperationService = TestBed.inject(ModeOperationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const modeOperation: IModeOperation = { id: 456 };

      activatedRoute.data = of({ modeOperation });
      comp.ngOnInit();

      expect(comp.modeOperation).toEqual(modeOperation);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IModeOperation>>();
      const modeOperation = { id: 123 };
      jest.spyOn(modeOperationFormService, 'getModeOperation').mockReturnValue(modeOperation);
      jest.spyOn(modeOperationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ modeOperation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: modeOperation }));
      saveSubject.complete();

      // THEN
      expect(modeOperationFormService.getModeOperation).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(modeOperationService.update).toHaveBeenCalledWith(expect.objectContaining(modeOperation));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IModeOperation>>();
      const modeOperation = { id: 123 };
      jest.spyOn(modeOperationFormService, 'getModeOperation').mockReturnValue({ id: null });
      jest.spyOn(modeOperationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ modeOperation: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: modeOperation }));
      saveSubject.complete();

      // THEN
      expect(modeOperationFormService.getModeOperation).toHaveBeenCalled();
      expect(modeOperationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IModeOperation>>();
      const modeOperation = { id: 123 };
      jest.spyOn(modeOperationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ modeOperation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(modeOperationService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
