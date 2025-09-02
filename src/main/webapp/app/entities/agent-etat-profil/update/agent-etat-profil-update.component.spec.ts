import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IAgent } from 'app/entities/agent/agent.model';
import { AgentService } from 'app/entities/agent/service/agent.service';
import { IEtablissement } from 'app/entities/etablissement/etablissement.model';
import { EtablissementService } from 'app/entities/etablissement/service/etablissement.service';
import { IAgentEtatProfil } from '../agent-etat-profil.model';
import { AgentEtatProfilService } from '../service/agent-etat-profil.service';
import { AgentEtatProfilFormService } from './agent-etat-profil-form.service';

import { AgentEtatProfilUpdateComponent } from './agent-etat-profil-update.component';

describe('AgentEtatProfil Management Update Component', () => {
  let comp: AgentEtatProfilUpdateComponent;
  let fixture: ComponentFixture<AgentEtatProfilUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let agentEtatProfilFormService: AgentEtatProfilFormService;
  let agentEtatProfilService: AgentEtatProfilService;
  let agentService: AgentService;
  let etablissementService: EtablissementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), AgentEtatProfilUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(AgentEtatProfilUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AgentEtatProfilUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    agentEtatProfilFormService = TestBed.inject(AgentEtatProfilFormService);
    agentEtatProfilService = TestBed.inject(AgentEtatProfilService);
    agentService = TestBed.inject(AgentService);
    etablissementService = TestBed.inject(EtablissementService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Agent query and add missing value', () => {
      const agentEtatProfil: IAgentEtatProfil = { id: 456 };
      const agent: IAgent = { id: 9359 };
      agentEtatProfil.agent = agent;

      const agentCollection: IAgent[] = [{ id: 30578 }];
      jest.spyOn(agentService, 'query').mockReturnValue(of(new HttpResponse({ body: agentCollection })));
      const additionalAgents = [agent];
      const expectedCollection: IAgent[] = [...additionalAgents, ...agentCollection];
      jest.spyOn(agentService, 'addAgentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ agentEtatProfil });
      comp.ngOnInit();

      expect(agentService.query).toHaveBeenCalled();
      expect(agentService.addAgentToCollectionIfMissing).toHaveBeenCalledWith(
        agentCollection,
        ...additionalAgents.map(expect.objectContaining),
      );
      expect(comp.agentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Etablissement query and add missing value', () => {
      const agentEtatProfil: IAgentEtatProfil = { id: 456 };
      const etablissement: IEtablissement = { id: 24546 };
      agentEtatProfil.etablissement = etablissement;

      const etablissementCollection: IEtablissement[] = [{ id: 18603 }];
      jest.spyOn(etablissementService, 'query').mockReturnValue(of(new HttpResponse({ body: etablissementCollection })));
      const additionalEtablissements = [etablissement];
      const expectedCollection: IEtablissement[] = [...additionalEtablissements, ...etablissementCollection];
      jest.spyOn(etablissementService, 'addEtablissementToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ agentEtatProfil });
      comp.ngOnInit();

      expect(etablissementService.query).toHaveBeenCalled();
      expect(etablissementService.addEtablissementToCollectionIfMissing).toHaveBeenCalledWith(
        etablissementCollection,
        ...additionalEtablissements.map(expect.objectContaining),
      );
      expect(comp.etablissementsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const agentEtatProfil: IAgentEtatProfil = { id: 456 };
      const agent: IAgent = { id: 8909 };
      agentEtatProfil.agent = agent;
      const etablissement: IEtablissement = { id: 24173 };
      agentEtatProfil.etablissement = etablissement;

      activatedRoute.data = of({ agentEtatProfil });
      comp.ngOnInit();

      expect(comp.agentsSharedCollection).toContain(agent);
      expect(comp.etablissementsSharedCollection).toContain(etablissement);
      expect(comp.agentEtatProfil).toEqual(agentEtatProfil);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAgentEtatProfil>>();
      const agentEtatProfil = { id: 123 };
      jest.spyOn(agentEtatProfilFormService, 'getAgentEtatProfil').mockReturnValue(agentEtatProfil);
      jest.spyOn(agentEtatProfilService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ agentEtatProfil });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: agentEtatProfil }));
      saveSubject.complete();

      // THEN
      expect(agentEtatProfilFormService.getAgentEtatProfil).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(agentEtatProfilService.update).toHaveBeenCalledWith(expect.objectContaining(agentEtatProfil));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAgentEtatProfil>>();
      const agentEtatProfil = { id: 123 };
      jest.spyOn(agentEtatProfilFormService, 'getAgentEtatProfil').mockReturnValue({ id: null });
      jest.spyOn(agentEtatProfilService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ agentEtatProfil: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: agentEtatProfil }));
      saveSubject.complete();

      // THEN
      expect(agentEtatProfilFormService.getAgentEtatProfil).toHaveBeenCalled();
      expect(agentEtatProfilService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAgentEtatProfil>>();
      const agentEtatProfil = { id: 123 };
      jest.spyOn(agentEtatProfilService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ agentEtatProfil });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(agentEtatProfilService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareAgent', () => {
      it('Should forward to agentService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(agentService, 'compareAgent');
        comp.compareAgent(entity, entity2);
        expect(agentService.compareAgent).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareEtablissement', () => {
      it('Should forward to etablissementService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(etablissementService, 'compareEtablissement');
        comp.compareEtablissement(entity, entity2);
        expect(etablissementService.compareEtablissement).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
