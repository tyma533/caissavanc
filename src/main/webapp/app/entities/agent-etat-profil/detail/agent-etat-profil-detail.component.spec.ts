import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AgentEtatProfilDetailComponent } from './agent-etat-profil-detail.component';

describe('AgentEtatProfil Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentEtatProfilDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: AgentEtatProfilDetailComponent,
              resolve: { agentEtatProfil: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(AgentEtatProfilDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load agentEtatProfil on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', AgentEtatProfilDetailComponent);

      // THEN
      expect(instance.agentEtatProfil).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
