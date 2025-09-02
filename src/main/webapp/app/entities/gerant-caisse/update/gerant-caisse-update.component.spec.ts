import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ICaisse } from 'app/entities/caisse/caisse.model';
import { CaisseService } from 'app/entities/caisse/service/caisse.service';
import { IGerant } from 'app/entities/gerant/gerant.model';
import { GerantService } from 'app/entities/gerant/service/gerant.service';
import { IGerantCaisse } from '../gerant-caisse.model';
import { GerantCaisseService } from '../service/gerant-caisse.service';
import { GerantCaisseFormService } from './gerant-caisse-form.service';

import { GerantCaisseUpdateComponent } from './gerant-caisse-update.component';

describe('GerantCaisse Management Update Component', () => {
  let comp: GerantCaisseUpdateComponent;
  let fixture: ComponentFixture<GerantCaisseUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let gerantCaisseFormService: GerantCaisseFormService;
  let gerantCaisseService: GerantCaisseService;
  let caisseService: CaisseService;
  let gerantService: GerantService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), GerantCaisseUpdateComponent],
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
      .overrideTemplate(GerantCaisseUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GerantCaisseUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    gerantCaisseFormService = TestBed.inject(GerantCaisseFormService);
    gerantCaisseService = TestBed.inject(GerantCaisseService);
    caisseService = TestBed.inject(CaisseService);
    gerantService = TestBed.inject(GerantService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Caisse query and add missing value', () => {
      const gerantCaisse: IGerantCaisse = { id: 456 };
      const caisse: ICaisse = { id: 16347 };
      gerantCaisse.caisse = caisse;

      const caisseCollection: ICaisse[] = [{ id: 11592 }];
      jest.spyOn(caisseService, 'query').mockReturnValue(of(new HttpResponse({ body: caisseCollection })));
      const additionalCaisses = [caisse];
      const expectedCollection: ICaisse[] = [...additionalCaisses, ...caisseCollection];
      jest.spyOn(caisseService, 'addCaisseToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ gerantCaisse });
      comp.ngOnInit();

      expect(caisseService.query).toHaveBeenCalled();
      expect(caisseService.addCaisseToCollectionIfMissing).toHaveBeenCalledWith(
        caisseCollection,
        ...additionalCaisses.map(expect.objectContaining),
      );
      expect(comp.caissesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Gerant query and add missing value', () => {
      const gerantCaisse: IGerantCaisse = { id: 456 };
      const gerant: IGerant = { id: 5421 };
      gerantCaisse.gerant = gerant;

      const gerantCollection: IGerant[] = [{ id: 24741 }];
      jest.spyOn(gerantService, 'query').mockReturnValue(of(new HttpResponse({ body: gerantCollection })));
      const additionalGerants = [gerant];
      const expectedCollection: IGerant[] = [...additionalGerants, ...gerantCollection];
      jest.spyOn(gerantService, 'addGerantToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ gerantCaisse });
      comp.ngOnInit();

      expect(gerantService.query).toHaveBeenCalled();
      expect(gerantService.addGerantToCollectionIfMissing).toHaveBeenCalledWith(
        gerantCollection,
        ...additionalGerants.map(expect.objectContaining),
      );
      expect(comp.gerantsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const gerantCaisse: IGerantCaisse = { id: 456 };
      const caisse: ICaisse = { id: 14413 };
      gerantCaisse.caisse = caisse;
      const gerant: IGerant = { id: 29235 };
      gerantCaisse.gerant = gerant;

      activatedRoute.data = of({ gerantCaisse });
      comp.ngOnInit();

      expect(comp.caissesSharedCollection).toContain(caisse);
      expect(comp.gerantsSharedCollection).toContain(gerant);
      expect(comp.gerantCaisse).toEqual(gerantCaisse);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGerantCaisse>>();
      const gerantCaisse = { id: 123 };
      jest.spyOn(gerantCaisseFormService, 'getGerantCaisse').mockReturnValue(gerantCaisse);
      jest.spyOn(gerantCaisseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gerantCaisse });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: gerantCaisse }));
      saveSubject.complete();

      // THEN
      expect(gerantCaisseFormService.getGerantCaisse).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(gerantCaisseService.update).toHaveBeenCalledWith(expect.objectContaining(gerantCaisse));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGerantCaisse>>();
      const gerantCaisse = { id: 123 };
      jest.spyOn(gerantCaisseFormService, 'getGerantCaisse').mockReturnValue({ id: null });
      jest.spyOn(gerantCaisseService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gerantCaisse: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: gerantCaisse }));
      saveSubject.complete();

      // THEN
      expect(gerantCaisseFormService.getGerantCaisse).toHaveBeenCalled();
      expect(gerantCaisseService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGerantCaisse>>();
      const gerantCaisse = { id: 123 };
      jest.spyOn(gerantCaisseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gerantCaisse });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(gerantCaisseService.update).toHaveBeenCalled();
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

    describe('compareGerant', () => {
      it('Should forward to gerantService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(gerantService, 'compareGerant');
        comp.compareGerant(entity, entity2);
        expect(gerantService.compareGerant).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
