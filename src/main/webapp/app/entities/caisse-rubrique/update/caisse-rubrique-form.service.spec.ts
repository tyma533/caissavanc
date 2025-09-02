import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../caisse-rubrique.test-samples';

import { CaisseRubriqueFormService } from './caisse-rubrique-form.service';

describe('CaisseRubrique Form Service', () => {
  let service: CaisseRubriqueFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaisseRubriqueFormService);
  });

  describe('Service methods', () => {
    describe('createCaisseRubriqueFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCaisseRubriqueFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dateHeureModification: expect.any(Object),
            dateHeureCreation: expect.any(Object),
            utiCree: expect.any(Object),
            utiModifie: expect.any(Object),
            caisse: expect.any(Object),
            rubrique: expect.any(Object),
          }),
        );
      });

      it('passing ICaisseRubrique should create a new form with FormGroup', () => {
        const formGroup = service.createCaisseRubriqueFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dateHeureModification: expect.any(Object),
            dateHeureCreation: expect.any(Object),
            utiCree: expect.any(Object),
            utiModifie: expect.any(Object),
            caisse: expect.any(Object),
            rubrique: expect.any(Object),
          }),
        );
      });
    });

    describe('getCaisseRubrique', () => {
      it('should return NewCaisseRubrique for default CaisseRubrique initial value', () => {
        const formGroup = service.createCaisseRubriqueFormGroup(sampleWithNewData);

        const caisseRubrique = service.getCaisseRubrique(formGroup) as any;

        expect(caisseRubrique).toMatchObject(sampleWithNewData);
      });

      it('should return NewCaisseRubrique for empty CaisseRubrique initial value', () => {
        const formGroup = service.createCaisseRubriqueFormGroup();

        const caisseRubrique = service.getCaisseRubrique(formGroup) as any;

        expect(caisseRubrique).toMatchObject({});
      });

      it('should return ICaisseRubrique', () => {
        const formGroup = service.createCaisseRubriqueFormGroup(sampleWithRequiredData);

        const caisseRubrique = service.getCaisseRubrique(formGroup) as any;

        expect(caisseRubrique).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICaisseRubrique should not enable id FormControl', () => {
        const formGroup = service.createCaisseRubriqueFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCaisseRubrique should disable id FormControl', () => {
        const formGroup = service.createCaisseRubriqueFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
