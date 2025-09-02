import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../caisse.test-samples';

import { CaisseFormService } from './caisse-form.service';

describe('Caisse Form Service', () => {
  let service: CaisseFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaisseFormService);
  });

  describe('Service methods', () => {
    describe('createCaisseFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCaisseFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            libelle: expect.any(Object),
            dateCreationCaisse: expect.any(Object),
            dateFermiture: expect.any(Object),
            solde: expect.any(Object),
            etat: expect.any(Object),
            dateHeureModification: expect.any(Object),
            dateHeureCreation: expect.any(Object),
            utiCree: expect.any(Object),
            utiModifie: expect.any(Object),
            etablissement: expect.any(Object),
          }),
        );
      });

      it('passing ICaisse should create a new form with FormGroup', () => {
        const formGroup = service.createCaisseFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            libelle: expect.any(Object),
            dateCreationCaisse: expect.any(Object),
            dateFermiture: expect.any(Object),
            solde: expect.any(Object),
            etat: expect.any(Object),
            dateHeureModification: expect.any(Object),
            dateHeureCreation: expect.any(Object),
            utiCree: expect.any(Object),
            utiModifie: expect.any(Object),
            etablissement: expect.any(Object),
          }),
        );
      });
    });

    describe('getCaisse', () => {
      it('should return NewCaisse for default Caisse initial value', () => {
        const formGroup = service.createCaisseFormGroup(sampleWithNewData);

        const caisse = service.getCaisse(formGroup) as any;

        expect(caisse).toMatchObject(sampleWithNewData);
      });

      it('should return NewCaisse for empty Caisse initial value', () => {
        const formGroup = service.createCaisseFormGroup();

        const caisse = service.getCaisse(formGroup) as any;

        expect(caisse).toMatchObject({});
      });

      it('should return ICaisse', () => {
        const formGroup = service.createCaisseFormGroup(sampleWithRequiredData);

        const caisse = service.getCaisse(formGroup) as any;

        expect(caisse).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICaisse should not enable id FormControl', () => {
        const formGroup = service.createCaisseFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCaisse should disable id FormControl', () => {
        const formGroup = service.createCaisseFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
