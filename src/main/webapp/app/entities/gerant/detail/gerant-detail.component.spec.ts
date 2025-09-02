import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { GerantDetailComponent } from './gerant-detail.component';

describe('Gerant Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerantDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: GerantDetailComponent,
              resolve: { gerant: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(GerantDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load gerant on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', GerantDetailComponent);

      // THEN
      expect(instance.gerant).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
