import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IOperation } from 'app/entities/operation/operation.model';
import { OperationService } from 'app/entities/operation/service/operation.service';
import { PieceJustificatifService } from '../service/piece-justificatif.service';
import { IPieceJustificatif } from '../piece-justificatif.model';
import { PieceJustificatifFormService } from './piece-justificatif-form.service';

import { PieceJustificatifUpdateComponent } from './piece-justificatif-update.component';

describe('PieceJustificatif Management Update Component', () => {
  let comp: PieceJustificatifUpdateComponent;
  let fixture: ComponentFixture<PieceJustificatifUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let pieceJustificatifFormService: PieceJustificatifFormService;
  let pieceJustificatifService: PieceJustificatifService;
  let operationService: OperationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), PieceJustificatifUpdateComponent],
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
      .overrideTemplate(PieceJustificatifUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PieceJustificatifUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    pieceJustificatifFormService = TestBed.inject(PieceJustificatifFormService);
    pieceJustificatifService = TestBed.inject(PieceJustificatifService);
    operationService = TestBed.inject(OperationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Operation query and add missing value', () => {
      const pieceJustificatif: IPieceJustificatif = { id: 456 };
      const operation: IOperation = { id: 1349 };
      pieceJustificatif.operation = operation;

      const operationCollection: IOperation[] = [{ id: 14641 }];
      jest.spyOn(operationService, 'query').mockReturnValue(of(new HttpResponse({ body: operationCollection })));
      const additionalOperations = [operation];
      const expectedCollection: IOperation[] = [...additionalOperations, ...operationCollection];
      jest.spyOn(operationService, 'addOperationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ pieceJustificatif });
      comp.ngOnInit();

      expect(operationService.query).toHaveBeenCalled();
      expect(operationService.addOperationToCollectionIfMissing).toHaveBeenCalledWith(
        operationCollection,
        ...additionalOperations.map(expect.objectContaining),
      );
      expect(comp.operationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const pieceJustificatif: IPieceJustificatif = { id: 456 };
      const operation: IOperation = { id: 17845 };
      pieceJustificatif.operation = operation;

      activatedRoute.data = of({ pieceJustificatif });
      comp.ngOnInit();

      expect(comp.operationsSharedCollection).toContain(operation);
      expect(comp.pieceJustificatif).toEqual(pieceJustificatif);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPieceJustificatif>>();
      const pieceJustificatif = { id: 123 };
      jest.spyOn(pieceJustificatifFormService, 'getPieceJustificatif').mockReturnValue(pieceJustificatif);
      jest.spyOn(pieceJustificatifService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pieceJustificatif });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pieceJustificatif }));
      saveSubject.complete();

      // THEN
      expect(pieceJustificatifFormService.getPieceJustificatif).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(pieceJustificatifService.update).toHaveBeenCalledWith(expect.objectContaining(pieceJustificatif));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPieceJustificatif>>();
      const pieceJustificatif = { id: 123 };
      jest.spyOn(pieceJustificatifFormService, 'getPieceJustificatif').mockReturnValue({ id: null });
      jest.spyOn(pieceJustificatifService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pieceJustificatif: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pieceJustificatif }));
      saveSubject.complete();

      // THEN
      expect(pieceJustificatifFormService.getPieceJustificatif).toHaveBeenCalled();
      expect(pieceJustificatifService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPieceJustificatif>>();
      const pieceJustificatif = { id: 123 };
      jest.spyOn(pieceJustificatifService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pieceJustificatif });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(pieceJustificatifService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareOperation', () => {
      it('Should forward to operationService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(operationService, 'compareOperation');
        comp.compareOperation(entity, entity2);
        expect(operationService.compareOperation).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
