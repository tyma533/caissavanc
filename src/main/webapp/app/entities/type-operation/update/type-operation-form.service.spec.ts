import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../type-operation.test-samples';

import { TypeOperationFormService } from './type-operation-form.service';

describe('TypeOperation Form Service', () => {
  let service: TypeOperationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeOperationFormService);
  });

  describe('Service methods', () => {
    describe('createTypeOperationFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTypeOperationFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            libelle: expect.any(Object),
            dateHeureModification: expect.any(Object),
            dateHeureCreation: expect.any(Object),
            utiCree: expect.any(Object),
            utiModifie: expect.any(Object),
          }),
        );
      });

      it('passing ITypeOperation should create a new form with FormGroup', () => {
        const formGroup = service.createTypeOperationFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            libelle: expect.any(Object),
            dateHeureModification: expect.any(Object),
            dateHeureCreation: expect.any(Object),
            utiCree: expect.any(Object),
            utiModifie: expect.any(Object),
          }),
        );
      });
    });

    describe('getTypeOperation', () => {
      it('should return NewTypeOperation for default TypeOperation initial value', () => {
        const formGroup = service.createTypeOperationFormGroup(sampleWithNewData);

        const typeOperation = service.getTypeOperation(formGroup) as any;

        expect(typeOperation).toMatchObject(sampleWithNewData);
      });

      it('should return NewTypeOperation for empty TypeOperation initial value', () => {
        const formGroup = service.createTypeOperationFormGroup();

        const typeOperation = service.getTypeOperation(formGroup) as any;

        expect(typeOperation).toMatchObject({});
      });

      it('should return ITypeOperation', () => {
        const formGroup = service.createTypeOperationFormGroup(sampleWithRequiredData);

        const typeOperation = service.getTypeOperation(formGroup) as any;

        expect(typeOperation).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITypeOperation should not enable id FormControl', () => {
        const formGroup = service.createTypeOperationFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTypeOperation should disable id FormControl', () => {
        const formGroup = service.createTypeOperationFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
