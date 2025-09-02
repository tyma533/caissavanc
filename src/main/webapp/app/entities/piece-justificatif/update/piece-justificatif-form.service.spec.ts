import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../piece-justificatif.test-samples';

import { PieceJustificatifFormService } from './piece-justificatif-form.service';

describe('PieceJustificatif Form Service', () => {
  let service: PieceJustificatifFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PieceJustificatifFormService);
  });

  describe('Service methods', () => {
    describe('createPieceJustificatifFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPieceJustificatifFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            libelle: expect.any(Object),
            piece: expect.any(Object),
            dateHeureModification: expect.any(Object),
            dateHeureCreation: expect.any(Object),
            utiCree: expect.any(Object),
            utiModifie: expect.any(Object),
            operation: expect.any(Object),
          }),
        );
      });

      it('passing IPieceJustificatif should create a new form with FormGroup', () => {
        const formGroup = service.createPieceJustificatifFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            libelle: expect.any(Object),
            piece: expect.any(Object),
            dateHeureModification: expect.any(Object),
            dateHeureCreation: expect.any(Object),
            utiCree: expect.any(Object),
            utiModifie: expect.any(Object),
            operation: expect.any(Object),
          }),
        );
      });
    });

    describe('getPieceJustificatif', () => {
      it('should return NewPieceJustificatif for default PieceJustificatif initial value', () => {
        const formGroup = service.createPieceJustificatifFormGroup(sampleWithNewData);

        const pieceJustificatif = service.getPieceJustificatif(formGroup) as any;

        expect(pieceJustificatif).toMatchObject(sampleWithNewData);
      });

      it('should return NewPieceJustificatif for empty PieceJustificatif initial value', () => {
        const formGroup = service.createPieceJustificatifFormGroup();

        const pieceJustificatif = service.getPieceJustificatif(formGroup) as any;

        expect(pieceJustificatif).toMatchObject({});
      });

      it('should return IPieceJustificatif', () => {
        const formGroup = service.createPieceJustificatifFormGroup(sampleWithRequiredData);

        const pieceJustificatif = service.getPieceJustificatif(formGroup) as any;

        expect(pieceJustificatif).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPieceJustificatif should not enable id FormControl', () => {
        const formGroup = service.createPieceJustificatifFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPieceJustificatif should disable id FormControl', () => {
        const formGroup = service.createPieceJustificatifFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
