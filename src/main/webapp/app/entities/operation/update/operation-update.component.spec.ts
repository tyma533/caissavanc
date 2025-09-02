import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ICaisse } from 'app/entities/caisse/caisse.model';
import { CaisseService } from 'app/entities/caisse/service/caisse.service';
import { ITypeOperation } from 'app/entities/type-operation/type-operation.model';
import { TypeOperationService } from 'app/entities/type-operation/service/type-operation.service';
import { IModeOperation } from 'app/entities/mode-operation/mode-operation.model';
import { ModeOperationService } from 'app/entities/mode-operation/service/mode-operation.service';
import { IOperation } from '../operation.model';
import { OperationService } from '../service/operation.service';
import { OperationFormService } from './operation-form.service';

import { OperationUpdateComponent } from './operation-update.component';

describe('Operation Management Update Component', () => {
  let comp: OperationUpdateComponent;
  let fixture: ComponentFixture<OperationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let operationFormService: OperationFormService;
  let operationService: OperationService;
  let caisseService: CaisseService;
  let typeOperationService: TypeOperationService;
  let modeOperationService: ModeOperationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), OperationUpdateComponent],
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
      .overrideTemplate(OperationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OperationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    operationFormService = TestBed.inject(OperationFormService);
    operationService = TestBed.inject(OperationService);
    caisseService = TestBed.inject(CaisseService);
    typeOperationService = TestBed.inject(TypeOperationService);
    modeOperationService = TestBed.inject(ModeOperationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Caisse query and add missing value', () => {
      const operation: IOperation = { id: 456 };
      const caisse: ICaisse = { id: 16830 };
      operation.caisse = caisse;

      const caisseCollection: ICaisse[] = [{ id: 7611 }];
      jest.spyOn(caisseService, 'query').mockReturnValue(of(new HttpResponse({ body: caisseCollection })));
      const additionalCaisses = [caisse];
      const expectedCollection: ICaisse[] = [...additionalCaisses, ...caisseCollection];
      jest.spyOn(caisseService, 'addCaisseToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ operation });
      comp.ngOnInit();

      expect(caisseService.query).toHaveBeenCalled();
      expect(caisseService.addCaisseToCollectionIfMissing).toHaveBeenCalledWith(
        caisseCollection,
        ...additionalCaisses.map(expect.objectContaining),
      );
      expect(comp.caissesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call TypeOperation query and add missing value', () => {
      const operation: IOperation = { id: 456 };
      const typeOperation: ITypeOperation = { id: 1434 };
      operation.typeOperation = typeOperation;

      const typeOperationCollection: ITypeOperation[] = [{ id: 6815 }];
      jest.spyOn(typeOperationService, 'query').mockReturnValue(of(new HttpResponse({ body: typeOperationCollection })));
      const additionalTypeOperations = [typeOperation];
      const expectedCollection: ITypeOperation[] = [...additionalTypeOperations, ...typeOperationCollection];
      jest.spyOn(typeOperationService, 'addTypeOperationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ operation });
      comp.ngOnInit();

      expect(typeOperationService.query).toHaveBeenCalled();
      expect(typeOperationService.addTypeOperationToCollectionIfMissing).toHaveBeenCalledWith(
        typeOperationCollection,
        ...additionalTypeOperations.map(expect.objectContaining),
      );
      expect(comp.typeOperationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call ModeOperation query and add missing value', () => {
      const operation: IOperation = { id: 456 };
      const modeOperation: IModeOperation = { id: 13995 };
      operation.modeOperation = modeOperation;

      const modeOperationCollection: IModeOperation[] = [{ id: 8781 }];
      jest.spyOn(modeOperationService, 'query').mockReturnValue(of(new HttpResponse({ body: modeOperationCollection })));
      const additionalModeOperations = [modeOperation];
      const expectedCollection: IModeOperation[] = [...additionalModeOperations, ...modeOperationCollection];
      jest.spyOn(modeOperationService, 'addModeOperationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ operation });
      comp.ngOnInit();

      expect(modeOperationService.query).toHaveBeenCalled();
      expect(modeOperationService.addModeOperationToCollectionIfMissing).toHaveBeenCalledWith(
        modeOperationCollection,
        ...additionalModeOperations.map(expect.objectContaining),
      );
      expect(comp.modeOperationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const operation: IOperation = { id: 456 };
      const caisse: ICaisse = { id: 21079 };
      operation.caisse = caisse;
      const typeOperation: ITypeOperation = { id: 3642 };
      operation.typeOperation = typeOperation;
      const modeOperation: IModeOperation = { id: 16337 };
      operation.modeOperation = modeOperation;

      activatedRoute.data = of({ operation });
      comp.ngOnInit();

      expect(comp.caissesSharedCollection).toContain(caisse);
      expect(comp.typeOperationsSharedCollection).toContain(typeOperation);
      expect(comp.modeOperationsSharedCollection).toContain(modeOperation);
      expect(comp.operation).toEqual(operation);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOperation>>();
      const operation = { id: 123 };
      jest.spyOn(operationFormService, 'getOperation').mockReturnValue(operation);
      jest.spyOn(operationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ operation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: operation }));
      saveSubject.complete();

      // THEN
      expect(operationFormService.getOperation).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(operationService.update).toHaveBeenCalledWith(expect.objectContaining(operation));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOperation>>();
      const operation = { id: 123 };
      jest.spyOn(operationFormService, 'getOperation').mockReturnValue({ id: null });
      jest.spyOn(operationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ operation: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: operation }));
      saveSubject.complete();

      // THEN
      expect(operationFormService.getOperation).toHaveBeenCalled();
      expect(operationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOperation>>();
      const operation = { id: 123 };
      jest.spyOn(operationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ operation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(operationService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCaisse', () => {
      it('Should forward to caisseService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(caisseService, 'compareCaisse');
        comp.compareCaisse(entity, entity2);
        expect(caisseService.compareCaisse).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareTypeOperation', () => {
      it('Should forward to typeOperationService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(typeOperationService, 'compareTypeOperation');
        comp.compareTypeOperation(entity, entity2);
        expect(typeOperationService.compareTypeOperation).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareModeOperation', () => {
      it('Should forward to modeOperationService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(modeOperationService, 'compareModeOperation');
        comp.compareModeOperation(entity, entity2);
        expect(modeOperationService.compareModeOperation).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
