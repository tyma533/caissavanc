import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../gerant.test-samples';

import { GerantFormService } from './gerant-form.service';

describe('Gerant Form Service', () => {
  let service: GerantFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GerantFormService);
  });

  describe('Service methods', () => {
    describe('createGerantFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createGerantFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nom: expect.any(Object),
            dateNomination: expect.any(Object),
            dateFin: expect.any(Object),
            dateHeureModification: expect.any(Object),
            dateHeureCreation: expect.any(Object),
            utiCree: expect.any(Object),
            utiModifie: expect.any(Object),
            agentEtatProfil: expect.any(Object),
          }),
        );
      });

      it('passing IGerant should create a new form with FormGroup', () => {
        const formGroup = service.createGerantFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nom: expect.any(Object),
            dateNomination: expect.any(Object),
            dateFin: expect.any(Object),
            dateHeureModification: expect.any(Object),
            dateHeureCreation: expect.any(Object),
            utiCree: expect.any(Object),
            utiModifie: expect.any(Object),
            agentEtatProfil: expect.any(Object),
          }),
        );
      });
    });

    describe('getGerant', () => {
      it('should return NewGerant for default Gerant initial value', () => {
        const formGroup = service.createGerantFormGroup(sampleWithNewData);

        const gerant = service.getGerant(formGroup) as any;

        expect(gerant).toMatchObject(sampleWithNewData);
      });

      it('should return NewGerant for empty Gerant initial value', () => {
        const formGroup = service.createGerantFormGroup();

        const gerant = service.getGerant(formGroup) as any;

        expect(gerant).toMatchObject({});
      });

      it('should return IGerant', () => {
        const formGroup = service.createGerantFormGroup(sampleWithRequiredData);

        const gerant = service.getGerant(formGroup) as any;

        expect(gerant).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IGerant should not enable id FormControl', () => {
        const formGroup = service.createGerantFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewGerant should disable id FormControl', () => {
        const formGroup = service.createGerantFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
