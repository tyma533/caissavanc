import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../etat-operation.test-samples';

import { EtatOperationFormService } from './etat-operation-form.service';

describe('EtatOperation Form Service', () => {
  let service: EtatOperationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EtatOperationFormService);
  });

  describe('Service methods', () => {
    describe('createEtatOperationFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEtatOperationFormGroup();

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

      it('passing IEtatOperation should create a new form with FormGroup', () => {
        const formGroup = service.createEtatOperationFormGroup(sampleWithRequiredData);

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

    describe('getEtatOperation', () => {
      it('should return NewEtatOperation for default EtatOperation initial value', () => {
        const formGroup = service.createEtatOperationFormGroup(sampleWithNewData);

        const etatOperation = service.getEtatOperation(formGroup) as any;

        expect(etatOperation).toMatchObject(sampleWithNewData);
      });

      it('should return NewEtatOperation for empty EtatOperation initial value', () => {
        const formGroup = service.createEtatOperationFormGroup();

        const etatOperation = service.getEtatOperation(formGroup) as any;

        expect(etatOperation).toMatchObject({});
      });

      it('should return IEtatOperation', () => {
        const formGroup = service.createEtatOperationFormGroup(sampleWithRequiredData);

        const etatOperation = service.getEtatOperation(formGroup) as any;

        expect(etatOperation).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEtatOperation should not enable id FormControl', () => {
        const formGroup = service.createEtatOperationFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEtatOperation should disable id FormControl', () => {
        const formGroup = service.createEtatOperationFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
