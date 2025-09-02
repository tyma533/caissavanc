import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IEtablissement } from 'app/entities/etablissement/etablissement.model';
import { EtablissementService } from 'app/entities/etablissement/service/etablissement.service';
import { CaisseService } from '../service/caisse.service';
import { ICaisse } from '../caisse.model';
import { CaisseFormService } from './caisse-form.service';

import { CaisseUpdateComponent } from './caisse-update.component';

describe('Caisse Management Update Component', () => {
  let comp: CaisseUpdateComponent;
  let fixture: ComponentFixture<CaisseUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let caisseFormService: CaisseFormService;
  let caisseService: CaisseService;
  let etablissementService: EtablissementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), CaisseUpdateComponent],
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
      .overrideTemplate(CaisseUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CaisseUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    caisseFormService = TestBed.inject(CaisseFormService);
    caisseService = TestBed.inject(CaisseService);
    etablissementService = TestBed.inject(EtablissementService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Etablissement query and add missing value', () => {
      const caisse: ICaisse = { id: 456 };
      const etablissement: IEtablissement = { id: 10914 };
      caisse.etablissement = etablissement;

      const etablissementCollection: IEtablissement[] = [{ id: 21449 }];
      jest.spyOn(etablissementService, 'query').mockReturnValue(of(new HttpResponse({ body: etablissementCollection })));
      const additionalEtablissements = [etablissement];
      const expectedCollection: IEtablissement[] = [...additionalEtablissements, ...etablissementCollection];
      jest.spyOn(etablissementService, 'addEtablissementToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ caisse });
      comp.ngOnInit();

      expect(etablissementService.query).toHaveBeenCalled();
      expect(etablissementService.addEtablissementToCollectionIfMissing).toHaveBeenCalledWith(
        etablissementCollection,
        ...additionalEtablissements.map(expect.objectContaining),
      );
      expect(comp.etablissementsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const caisse: ICaisse = { id: 456 };
      const etablissement: IEtablissement = { id: 21317 };
      caisse.etablissement = etablissement;

      activatedRoute.data = of({ caisse });
      comp.ngOnInit();

      expect(comp.etablissementsSharedCollection).toContain(etablissement);
      expect(comp.caisse).toEqual(caisse);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICaisse>>();
      const caisse = { id: 123 };
      jest.spyOn(caisseFormService, 'getCaisse').mockReturnValue(caisse);
      jest.spyOn(caisseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ caisse });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: caisse }));
      saveSubject.complete();

      // THEN
      expect(caisseFormService.getCaisse).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(caisseService.update).toHaveBeenCalledWith(expect.objectContaining(caisse));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICaisse>>();
      const caisse = { id: 123 };
      jest.spyOn(caisseFormService, 'getCaisse').mockReturnValue({ id: null });
      jest.spyOn(caisseService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ caisse: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: caisse }));
      saveSubject.complete();

      // THEN
      expect(caisseFormService.getCaisse).toHaveBeenCalled();
      expect(caisseService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICaisse>>();
      const caisse = { id: 123 };
      jest.spyOn(caisseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ caisse });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(caisseService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
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
