import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { EtatOperationDetailComponent } from './etat-operation-detail.component';

describe('EtatOperation Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EtatOperationDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: EtatOperationDetailComponent,
              resolve: { etatOperation: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(EtatOperationDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load etatOperation on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', EtatOperationDetailComponent);

      // THEN
      expect(instance.etatOperation).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
