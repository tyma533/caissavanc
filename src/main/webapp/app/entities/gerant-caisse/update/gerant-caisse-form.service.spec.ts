import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../gerant-caisse.test-samples';

import { GerantCaisseFormService } from './gerant-caisse-form.service';

describe('GerantCaisse Form Service', () => {
  let service: GerantCaisseFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GerantCaisseFormService);
  });

  describe('Service methods', () => {
    describe('createGerantCaisseFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createGerantCaisseFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            actif: expect.any(Object),
            dateHeureModification: expect.any(Object),
            dateHeureCreation: expect.any(Object),
            utiCree: expect.any(Object),
            utiModifie: expect.any(Object),
            caisse: expect.any(Object),
            gerant: expect.any(Object),
          }),
        );
      });

      it('passing IGerantCaisse should create a new form with FormGroup', () => {
        const formGroup = service.createGerantCaisseFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            actif: expect.any(Object),
            dateHeureModification: expect.any(Object),
            dateHeureCreation: expect.any(Object),
            utiCree: expect.any(Object),
            utiModifie: expect.any(Object),
            caisse: expect.any(Object),
            gerant: expect.any(Object),
          }),
        );
      });
    });

    describe('getGerantCaisse', () => {
      it('should return NewGerantCaisse for default GerantCaisse initial value', () => {
        const formGroup = service.createGerantCaisseFormGroup(sampleWithNewData);

        const gerantCaisse = service.getGerantCaisse(formGroup) as any;

        expect(gerantCaisse).toMatchObject(sampleWithNewData);
      });

      it('should return NewGerantCaisse for empty GerantCaisse initial value', () => {
        const formGroup = service.createGerantCaisseFormGroup();

        const gerantCaisse = service.getGerantCaisse(formGroup) as any;

        expect(gerantCaisse).toMatchObject({});
      });

      it('should return IGerantCaisse', () => {
        const formGroup = service.createGerantCaisseFormGroup(sampleWithRequiredData);

        const gerantCaisse = service.getGerantCaisse(formGroup) as any;

        expect(gerantCaisse).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IGerantCaisse should not enable id FormControl', () => {
        const formGroup = service.createGerantCaisseFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewGerantCaisse should disable id FormControl', () => {
        const formGroup = service.createGerantCaisseFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
