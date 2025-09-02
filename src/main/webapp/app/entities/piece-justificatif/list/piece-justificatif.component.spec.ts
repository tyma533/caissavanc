import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PieceJustificatifService } from '../service/piece-justificatif.service';

import { PieceJustificatifComponent } from './piece-justificatif.component';

describe('PieceJustificatif Management Component', () => {
  let comp: PieceJustificatifComponent;
  let fixture: ComponentFixture<PieceJustificatifComponent>;
  let service: PieceJustificatifService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'piece-justificatif', component: PieceJustificatifComponent }]),
        HttpClientTestingModule,
        PieceJustificatifComponent,
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
      .overrideTemplate(PieceJustificatifComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PieceJustificatifComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PieceJustificatifService);

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
    expect(comp.pieceJustificatifs?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to pieceJustificatifService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getPieceJustificatifIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getPieceJustificatifIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
