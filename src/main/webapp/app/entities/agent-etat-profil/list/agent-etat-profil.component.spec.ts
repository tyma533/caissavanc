import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AgentEtatProfilService } from '../service/agent-etat-profil.service';

import { AgentEtatProfilComponent } from './agent-etat-profil.component';

describe('AgentEtatProfil Management Component', () => {
  let comp: AgentEtatProfilComponent;
  let fixture: ComponentFixture<AgentEtatProfilComponent>;
  let service: AgentEtatProfilService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'agent-etat-profil', component: AgentEtatProfilComponent }]),
        HttpClientTestingModule,
        AgentEtatProfilComponent,
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
      .overrideTemplate(AgentEtatProfilComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AgentEtatProfilComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AgentEtatProfilService);

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
    expect(comp.agentEtatProfils?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to agentEtatProfilService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getAgentEtatProfilIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getAgentEtatProfilIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
