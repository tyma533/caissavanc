import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../agent-etat-profil.test-samples';

import { AgentEtatProfilFormService } from './agent-etat-profil-form.service';

describe('AgentEtatProfil Form Service', () => {
  let service: AgentEtatProfilFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentEtatProfilFormService);
  });

  describe('Service methods', () => {
    describe('createAgentEtatProfilFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAgentEtatProfilFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            profil: expect.any(Object),
            actif: expect.any(Object),
            dateHeureModification: expect.any(Object),
            dateHeureCreation: expect.any(Object),
            modifiedBy: expect.any(Object),
            createdBy: expect.any(Object),
            agent: expect.any(Object),
            etablissement: expect.any(Object),
          }),
        );
      });

      it('passing IAgentEtatProfil should create a new form with FormGroup', () => {
        const formGroup = service.createAgentEtatProfilFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            profil: expect.any(Object),
            actif: expect.any(Object),
            dateHeureModification: expect.any(Object),
            dateHeureCreation: expect.any(Object),
            modifiedBy: expect.any(Object),
            createdBy: expect.any(Object),
            agent: expect.any(Object),
            etablissement: expect.any(Object),
          }),
        );
      });
    });

    describe('getAgentEtatProfil', () => {
      it('should return NewAgentEtatProfil for default AgentEtatProfil initial value', () => {
        const formGroup = service.createAgentEtatProfilFormGroup(sampleWithNewData);

        const agentEtatProfil = service.getAgentEtatProfil(formGroup) as any;

        expect(agentEtatProfil).toMatchObject(sampleWithNewData);
      });

      it('should return NewAgentEtatProfil for empty AgentEtatProfil initial value', () => {
        const formGroup = service.createAgentEtatProfilFormGroup();

        const agentEtatProfil = service.getAgentEtatProfil(formGroup) as any;

        expect(agentEtatProfil).toMatchObject({});
      });

      it('should return IAgentEtatProfil', () => {
        const formGroup = service.createAgentEtatProfilFormGroup(sampleWithRequiredData);

        const agentEtatProfil = service.getAgentEtatProfil(formGroup) as any;

        expect(agentEtatProfil).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAgentEtatProfil should not enable id FormControl', () => {
        const formGroup = service.createAgentEtatProfilFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAgentEtatProfil should disable id FormControl', () => {
        const formGroup = service.createAgentEtatProfilFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
