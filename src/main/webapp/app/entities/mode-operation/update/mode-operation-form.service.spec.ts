import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../mode-operation.test-samples';

import { ModeOperationFormService } from './mode-operation-form.service';

describe('ModeOperation Form Service', () => {
  let service: ModeOperationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModeOperationFormService);
  });

  describe('Service methods', () => {
    describe('createModeOperationFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createModeOperationFormGroup();

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

      it('passing IModeOperation should create a new form with FormGroup', () => {
        const formGroup = service.createModeOperationFormGroup(sampleWithRequiredData);

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

    describe('getModeOperation', () => {
      it('should return NewModeOperation for default ModeOperation initial value', () => {
        const formGroup = service.createModeOperationFormGroup(sampleWithNewData);

        const modeOperation = service.getModeOperation(formGroup) as any;

        expect(modeOperation).toMatchObject(sampleWithNewData);
      });

      it('should return NewModeOperation for empty ModeOperation initial value', () => {
        const formGroup = service.createModeOperationFormGroup();

        const modeOperation = service.getModeOperation(formGroup) as any;

        expect(modeOperation).toMatchObject({});
      });

      it('should return IModeOperation', () => {
        const formGroup = service.createModeOperationFormGroup(sampleWithRequiredData);

        const modeOperation = service.getModeOperation(formGroup) as any;

        expect(modeOperation).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IModeOperation should not enable id FormControl', () => {
        const formGroup = service.createModeOperationFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewModeOperation should disable id FormControl', () => {
        const formGroup = service.createModeOperationFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
