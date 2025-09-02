import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IAgentEtatProfil } from 'app/entities/agent-etat-profil/agent-etat-profil.model';
import { AgentEtatProfilService } from 'app/entities/agent-etat-profil/service/agent-etat-profil.service';
import { GerantService } from '../service/gerant.service';
import { IGerant } from '../gerant.model';
import { GerantFormService } from './gerant-form.service';

import { GerantUpdateComponent } from './gerant-update.component';

describe('Gerant Management Update Component', () => {
  let comp: GerantUpdateComponent;
  let fixture: ComponentFixture<GerantUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let gerantFormService: GerantFormService;
  let gerantService: GerantService;
  let agentEtatProfilService: AgentEtatProfilService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), GerantUpdateComponent],
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
      .overrideTemplate(GerantUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GerantUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    gerantFormService = TestBed.inject(GerantFormService);
    gerantService = TestBed.inject(GerantService);
    agentEtatProfilService = TestBed.inject(AgentEtatProfilService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call AgentEtatProfil query and add missing value', () => {
      const gerant: IGerant = { id: 456 };
      const agentEtatProfil: IAgentEtatProfil = { id: 12477 };
      gerant.agentEtatProfil = agentEtatProfil;

      const agentEtatProfilCollection: IAgentEtatProfil[] = [{ id: 20744 }];
      jest.spyOn(agentEtatProfilService, 'query').mockReturnValue(of(new HttpResponse({ body: agentEtatProfilCollection })));
      const additionalAgentEtatProfils = [agentEtatProfil];
      const expectedCollection: IAgentEtatProfil[] = [...additionalAgentEtatProfils, ...agentEtatProfilCollection];
      jest.spyOn(agentEtatProfilService, 'addAgentEtatProfilToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ gerant });
      comp.ngOnInit();

      expect(agentEtatProfilService.query).toHaveBeenCalled();
      expect(agentEtatProfilService.addAgentEtatProfilToCollectionIfMissing).toHaveBeenCalledWith(
        agentEtatProfilCollection,
        ...additionalAgentEtatProfils.map(expect.objectContaining),
      );
      expect(comp.agentEtatProfilsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const gerant: IGerant = { id: 456 };
      const agentEtatProfil: IAgentEtatProfil = { id: 8953 };
      gerant.agentEtatProfil = agentEtatProfil;

      activatedRoute.data = of({ gerant });
      comp.ngOnInit();

      expect(comp.agentEtatProfilsSharedCollection).toContain(agentEtatProfil);
      expect(comp.gerant).toEqual(gerant);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGerant>>();
      const gerant = { id: 123 };
      jest.spyOn(gerantFormService, 'getGerant').mockReturnValue(gerant);
      jest.spyOn(gerantService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gerant });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: gerant }));
      saveSubject.complete();

      // THEN
      expect(gerantFormService.getGerant).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(gerantService.update).toHaveBeenCalledWith(expect.objectContaining(gerant));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGerant>>();
      const gerant = { id: 123 };
      jest.spyOn(gerantFormService, 'getGerant').mockReturnValue({ id: null });
      jest.spyOn(gerantService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gerant: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: gerant }));
      saveSubject.complete();

      // THEN
      expect(gerantFormService.getGerant).toHaveBeenCalled();
      expect(gerantService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGerant>>();
      const gerant = { id: 123 };
      jest.spyOn(gerantService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gerant });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(gerantService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareAgentEtatProfil', () => {
      it('Should forward to agentEtatProfilService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(agentEtatProfilService, 'compareAgentEtatProfil');
        comp.compareAgentEtatProfil(entity, entity2);
        expect(agentEtatProfilService.compareAgentEtatProfil).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
