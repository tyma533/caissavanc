import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ICaisse } from 'app/entities/caisse/caisse.model';
import { CaisseService } from 'app/entities/caisse/service/caisse.service';
import { ControleService } from '../service/controle.service';
import { IControle } from '../controle.model';
import { ControleFormService } from './controle-form.service';

import { ControleUpdateComponent } from './controle-update.component';

describe('Controle Management Update Component', () => {
  let comp: ControleUpdateComponent;
  let fixture: ComponentFixture<ControleUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let controleFormService: ControleFormService;
  let controleService: ControleService;
  let caisseService: CaisseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ControleUpdateComponent],
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
      .overrideTemplate(ControleUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ControleUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    controleFormService = TestBed.inject(ControleFormService);
    controleService = TestBed.inject(ControleService);
    caisseService = TestBed.inject(CaisseService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Caisse query and add missing value', () => {
      const controle: IControle = { id: 456 };
      const caisse: ICaisse = { id: 29453 };
      controle.caisse = caisse;

      const caisseCollection: ICaisse[] = [{ id: 24370 }];
      jest.spyOn(caisseService, 'query').mockReturnValue(of(new HttpResponse({ body: caisseCollection })));
      const additionalCaisses = [caisse];
      const expectedCollection: ICaisse[] = [...additionalCaisses, ...caisseCollection];
      jest.spyOn(caisseService, 'addCaisseToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ controle });
      comp.ngOnInit();

      expect(caisseService.query).toHaveBeenCalled();
      expect(caisseService.addCaisseToCollectionIfMissing).toHaveBeenCalledWith(
        caisseCollection,
        ...additionalCaisses.map(expect.objectContaining),
      );
      expect(comp.caissesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const controle: IControle = { id: 456 };
      const caisse: ICaisse = { id: 14037 };
      controle.caisse = caisse;

      activatedRoute.data = of({ controle });
      comp.ngOnInit();

      expect(comp.caissesSharedCollection).toContain(caisse);
      expect(comp.controle).toEqual(controle);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IControle>>();
      const controle = { id: 123 };
      jest.spyOn(controleFormService, 'getControle').mockReturnValue(controle);
      jest.spyOn(controleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ controle });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: controle }));
      saveSubject.complete();

      // THEN
      expect(controleFormService.getControle).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(controleService.update).toHaveBeenCalledWith(expect.objectContaining(controle));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IControle>>();
      const controle = { id: 123 };
      jest.spyOn(controleFormService, 'getControle').mockReturnValue({ id: null });
      jest.spyOn(controleService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ controle: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: controle }));
      saveSubject.complete();

      // THEN
      expect(controleFormService.getControle).toHaveBeenCalled();
      expect(controleService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IControle>>();
      const controle = { id: 123 };
      jest.spyOn(controleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ controle });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(controleService.update).toHaveBeenCalled();
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
  });
});
