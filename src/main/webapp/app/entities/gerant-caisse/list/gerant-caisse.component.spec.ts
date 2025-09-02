import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { GerantCaisseService } from '../service/gerant-caisse.service';

import { GerantCaisseComponent } from './gerant-caisse.component';

describe('GerantCaisse Management Component', () => {
  let comp: GerantCaisseComponent;
  let fixture: ComponentFixture<GerantCaisseComponent>;
  let service: GerantCaisseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'gerant-caisse', component: GerantCaisseComponent }]),
        HttpClientTestingModule,
        GerantCaisseComponent,
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
      .overrideTemplate(GerantCaisseComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GerantCaisseComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(GerantCaisseService);

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
    expect(comp.gerantCaisses?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to gerantCaisseService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getGerantCaisseIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getGerantCaisseIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
