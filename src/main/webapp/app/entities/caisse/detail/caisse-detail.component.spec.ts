import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CaisseDetailComponent } from './caisse-detail.component';

describe('Caisse Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaisseDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: CaisseDetailComponent,
              resolve: { caisse: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(CaisseDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load caisse on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', CaisseDetailComponent);

      // THEN
      expect(instance.caisse).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
