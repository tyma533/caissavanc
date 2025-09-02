import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CaisseRubriqueDetailComponent } from './caisse-rubrique-detail.component';

describe('CaisseRubrique Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaisseRubriqueDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: CaisseRubriqueDetailComponent,
              resolve: { caisseRubrique: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(CaisseRubriqueDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load caisseRubrique on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', CaisseRubriqueDetailComponent);

      // THEN
      expect(instance.caisseRubrique).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
