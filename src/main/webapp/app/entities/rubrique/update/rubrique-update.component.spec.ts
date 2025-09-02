import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { RubriqueService } from '../service/rubrique.service';
import { IRubrique } from '../rubrique.model';
import { RubriqueFormService } from './rubrique-form.service';

import { RubriqueUpdateComponent } from './rubrique-update.component';

describe('Rubrique Management Update Component', () => {
  let comp: RubriqueUpdateComponent;
  let fixture: ComponentFixture<RubriqueUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let rubriqueFormService: RubriqueFormService;
  let rubriqueService: RubriqueService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), RubriqueUpdateComponent],
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
      .overrideTemplate(RubriqueUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RubriqueUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    rubriqueFormService = TestBed.inject(RubriqueFormService);
    rubriqueService = TestBed.inject(RubriqueService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const rubrique: IRubrique = { id: 456 };

      activatedRoute.data = of({ rubrique });
      comp.ngOnInit();

      expect(comp.rubrique).toEqual(rubrique);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRubrique>>();
      const rubrique = { id: 123 };
      jest.spyOn(rubriqueFormService, 'getRubrique').mockReturnValue(rubrique);
      jest.spyOn(rubriqueService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ rubrique });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: rubrique }));
      saveSubject.complete();

      // THEN
      expect(rubriqueFormService.getRubrique).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(rubriqueService.update).toHaveBeenCalledWith(expect.objectContaining(rubrique));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRubrique>>();
      const rubrique = { id: 123 };
      jest.spyOn(rubriqueFormService, 'getRubrique').mockReturnValue({ id: null });
      jest.spyOn(rubriqueService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ rubrique: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: rubrique }));
      saveSubject.complete();

      // THEN
      expect(rubriqueFormService.getRubrique).toHaveBeenCalled();
      expect(rubriqueService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRubrique>>();
      const rubrique = { id: 123 };
      jest.spyOn(rubriqueService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ rubrique });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(rubriqueService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
