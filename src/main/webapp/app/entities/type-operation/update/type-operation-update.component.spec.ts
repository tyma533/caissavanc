import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TypeOperationService } from '../service/type-operation.service';
import { ITypeOperation } from '../type-operation.model';
import { TypeOperationFormService } from './type-operation-form.service';

import { TypeOperationUpdateComponent } from './type-operation-update.component';

describe('TypeOperation Management Update Component', () => {
  let comp: TypeOperationUpdateComponent;
  let fixture: ComponentFixture<TypeOperationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let typeOperationFormService: TypeOperationFormService;
  let typeOperationService: TypeOperationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), TypeOperationUpdateComponent],
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
      .overrideTemplate(TypeOperationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TypeOperationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    typeOperationFormService = TestBed.inject(TypeOperationFormService);
    typeOperationService = TestBed.inject(TypeOperationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const typeOperation: ITypeOperation = { id: 456 };

      activatedRoute.data = of({ typeOperation });
      comp.ngOnInit();

      expect(comp.typeOperation).toEqual(typeOperation);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITypeOperation>>();
      const typeOperation = { id: 123 };
      jest.spyOn(typeOperationFormService, 'getTypeOperation').mockReturnValue(typeOperation);
      jest.spyOn(typeOperationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typeOperation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: typeOperation }));
      saveSubject.complete();

      // THEN
      expect(typeOperationFormService.getTypeOperation).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(typeOperationService.update).toHaveBeenCalledWith(expect.objectContaining(typeOperation));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITypeOperation>>();
      const typeOperation = { id: 123 };
      jest.spyOn(typeOperationFormService, 'getTypeOperation').mockReturnValue({ id: null });
      jest.spyOn(typeOperationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typeOperation: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: typeOperation }));
      saveSubject.complete();

      // THEN
      expect(typeOperationFormService.getTypeOperation).toHaveBeenCalled();
      expect(typeOperationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITypeOperation>>();
      const typeOperation = { id: 123 };
      jest.spyOn(typeOperationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typeOperation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(typeOperationService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
