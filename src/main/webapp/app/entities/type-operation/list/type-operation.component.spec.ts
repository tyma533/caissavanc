import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { TypeOperationService } from '../service/type-operation.service';

import { TypeOperationComponent } from './type-operation.component';

describe('TypeOperation Management Component', () => {
  let comp: TypeOperationComponent;
  let fixture: ComponentFixture<TypeOperationComponent>;
  let service: TypeOperationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'type-operation', component: TypeOperationComponent }]),
        HttpClientTestingModule,
        TypeOperationComponent,
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
      .overrideTemplate(TypeOperationComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TypeOperationComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TypeOperationService);

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
    expect(comp.typeOperations?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to typeOperationService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getTypeOperationIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getTypeOperationIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
