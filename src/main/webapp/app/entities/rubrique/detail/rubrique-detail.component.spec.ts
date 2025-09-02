import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { RubriqueDetailComponent } from './rubrique-detail.component';

describe('Rubrique Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RubriqueDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: RubriqueDetailComponent,
              resolve: { rubrique: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(RubriqueDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load rubrique on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', RubriqueDetailComponent);

      // THEN
      expect(instance.rubrique).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
