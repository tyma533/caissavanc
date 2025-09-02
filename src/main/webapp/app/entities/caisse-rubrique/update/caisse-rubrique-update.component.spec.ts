import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ICaisse } from 'app/entities/caisse/caisse.model';
import { CaisseService } from 'app/entities/caisse/service/caisse.service';
import { IRubrique } from 'app/entities/rubrique/rubrique.model';
import { RubriqueService } from 'app/entities/rubrique/service/rubrique.service';
import { ICaisseRubrique } from '../caisse-rubrique.model';
import { CaisseRubriqueService } from '../service/caisse-rubrique.service';
import { CaisseRubriqueFormService } from './caisse-rubrique-form.service';

import { CaisseRubriqueUpdateComponent } from './caisse-rubrique-update.component';

describe('CaisseRubrique Management Update Component', () => {
  let comp: CaisseRubriqueUpdateComponent;
  let fixture: ComponentFixture<CaisseRubriqueUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let caisseRubriqueFormService: CaisseRubriqueFormService;
  let caisseRubriqueService: CaisseRubriqueService;
  let caisseService: CaisseService;
  let rubriqueService: RubriqueService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), CaisseRubriqueUpdateComponent],
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
      .overrideTemplate(CaisseRubriqueUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CaisseRubriqueUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    caisseRubriqueFormService = TestBed.inject(CaisseRubriqueFormService);
    caisseRubriqueService = TestBed.inject(CaisseRubriqueService);
    caisseService = TestBed.inject(CaisseService);
    rubriqueService = TestBed.inject(RubriqueService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Caisse query and add missing value', () => {
      const caisseRubrique: ICaisseRubrique = { id: 456 };
      const caisse: ICaisse = { id: 19718 };
      caisseRubrique.caisse = caisse;

      const caisseCollection: ICaisse[] = [{ id: 19976 }];
      jest.spyOn(caisseService, 'query').mockReturnValue(of(new HttpResponse({ body: caisseCollection })));
      const additionalCaisses = [caisse];
      const expectedCollection: ICaisse[] = [...additionalCaisses, ...caisseCollection];
      jest.spyOn(caisseService, 'addCaisseToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ caisseRubrique });
      comp.ngOnInit();

      expect(caisseService.query).toHaveBeenCalled();
      expect(caisseService.addCaisseToCollectionIfMissing).toHaveBeenCalledWith(
        caisseCollection,
        ...additionalCaisses.map(expect.objectContaining),
      );
      expect(comp.caissesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Rubrique query and add missing value', () => {
      const caisseRubrique: ICaisseRubrique = { id: 456 };
      const rubrique: IRubrique = { id: 23599 };
      caisseRubrique.rubrique = rubrique;

      const rubriqueCollection: IRubrique[] = [{ id: 21639 }];
      jest.spyOn(rubriqueService, 'query').mockReturnValue(of(new HttpResponse({ body: rubriqueCollection })));
      const additionalRubriques = [rubrique];
      const expectedCollection: IRubrique[] = [...additionalRubriques, ...rubriqueCollection];
      jest.spyOn(rubriqueService, 'addRubriqueToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ caisseRubrique });
      comp.ngOnInit();

      expect(rubriqueService.query).toHaveBeenCalled();
      expect(rubriqueService.addRubriqueToCollectionIfMissing).toHaveBeenCalledWith(
        rubriqueCollection,
        ...additionalRubriques.map(expect.objectContaining),
      );
      expect(comp.rubriquesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const caisseRubrique: ICaisseRubrique = { id: 456 };
      const caisse: ICaisse = { id: 13551 };
      caisseRubrique.caisse = caisse;
      const rubrique: IRubrique = { id: 13436 };
      caisseRubrique.rubrique = rubrique;

      activatedRoute.data = of({ caisseRubrique });
      comp.ngOnInit();

      expect(comp.caissesSharedCollection).toContain(caisse);
      expect(comp.rubriquesSharedCollection).toContain(rubrique);
      expect(comp.caisseRubrique).toEqual(caisseRubrique);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICaisseRubrique>>();
      const caisseRubrique = { id: 123 };
      jest.spyOn(caisseRubriqueFormService, 'getCaisseRubrique').mockReturnValue(caisseRubrique);
      jest.spyOn(caisseRubriqueService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ caisseRubrique });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: caisseRubrique }));
      saveSubject.complete();

      // THEN
      expect(caisseRubriqueFormService.getCaisseRubrique).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(caisseRubriqueService.update).toHaveBeenCalledWith(expect.objectContaining(caisseRubrique));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICaisseRubrique>>();
      const caisseRubrique = { id: 123 };
      jest.spyOn(caisseRubriqueFormService, 'getCaisseRubrique').mockReturnValue({ id: null });
      jest.spyOn(caisseRubriqueService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ caisseRubrique: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: caisseRubrique }));
      saveSubject.complete();

      // THEN
      expect(caisseRubriqueFormService.getCaisseRubrique).toHaveBeenCalled();
      expect(caisseRubriqueService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICaisseRubrique>>();
      const caisseRubrique = { id: 123 };
      jest.spyOn(caisseRubriqueService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ caisseRubrique });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(caisseRubriqueService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCaisse', () => {
      it('Should forward to caisseService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(caisseService, 'compareCaisse');
        comp.compareCaisse(entity, entity2);
        expect(caisseService.compareCaisse).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareRubrique', () => {
      it('Should forward to rubriqueService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(rubriqueService, 'compareRubrique');
        comp.compareRubrique(entity, entity2);
        expect(rubriqueService.compareRubrique).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
