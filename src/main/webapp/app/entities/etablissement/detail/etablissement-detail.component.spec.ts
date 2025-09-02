import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { EtablissementDetailComponent } from './etablissement-detail.component';

describe('Etablissement Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EtablissementDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: EtablissementDetailComponent,
              resolve: { etablissement: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(EtablissementDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load etablissement on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', EtablissementDetailComponent);

      // THEN
      expect(instance.etablissement).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
