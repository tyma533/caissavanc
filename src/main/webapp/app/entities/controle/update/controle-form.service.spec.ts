import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../controle.test-samples';

import { ControleFormService } from './controle-form.service';

describe('Controle Form Service', () => {
  let service: ControleFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControleFormService);
  });

  describe('Service methods', () => {
    describe('createControleFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createControleFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dateControle: expect.any(Object),
            observation: expect.any(Object),
            dateHeureModification: expect.any(Object),
            dateHeureCreation: expect.any(Object),
            utiCree: expect.any(Object),
            utiModifie: expect.any(Object),
            caisse: expect.any(Object),
          }),
        );
      });

      it('passing IControle should create a new form with FormGroup', () => {
        const formGroup = service.createControleFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dateControle: expect.any(Object),
            observation: expect.any(Object),
            dateHeureModification: expect.any(Object),
            dateHeureCreation: expect.any(Object),
            utiCree: expect.any(Object),
            utiModifie: expect.any(Object),
            caisse: expect.any(Object),
          }),
        );
      });
    });

    describe('getControle', () => {
      it('should return NewControle for default Controle initial value', () => {
        const formGroup = service.createControleFormGroup(sampleWithNewData);

        const controle = service.getControle(formGroup) as any;

        expect(controle).toMatchObject(sampleWithNewData);
      });

      it('should return NewControle for empty Controle initial value', () => {
        const formGroup = service.createControleFormGroup();

        const controle = service.getControle(formGroup) as any;

        expect(controle).toMatchObject({});
      });

      it('should return IControle', () => {
        const formGroup = service.createControleFormGroup(sampleWithRequiredData);

        const controle = service.getControle(formGroup) as any;

        expect(controle).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IControle should not enable id FormControl', () => {
        const formGroup = service.createControleFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewControle should disable id FormControl', () => {
        const formGroup = service.createControleFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
