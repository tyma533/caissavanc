import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { EtatOperationService } from '../service/etat-operation.service';

import { EtatOperationComponent } from './etat-operation.component';

describe('EtatOperation Management Component', () => {
  let comp: EtatOperationComponent;
  let fixture: ComponentFixture<EtatOperationComponent>;
  let service: EtatOperationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'etat-operation', component: EtatOperationComponent }]),
        HttpClientTestingModule,
        EtatOperationComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              }),
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(EtatOperationComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EtatOperationComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(EtatOperationService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        }),
      ),
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.etatOperations?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to etatOperationService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getEtatOperationIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getEtatOperationIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
