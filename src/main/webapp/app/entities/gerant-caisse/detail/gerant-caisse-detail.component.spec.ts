import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { GerantCaisseDetailComponent } from './gerant-caisse-detail.component';

describe('GerantCaisse Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerantCaisseDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: GerantCaisseDetailComponent,
              resolve: { gerantCaisse: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(GerantCaisseDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load gerantCaisse on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', GerantCaisseDetailComponent);

      // THEN
      expect(instance.gerantCaisse).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
