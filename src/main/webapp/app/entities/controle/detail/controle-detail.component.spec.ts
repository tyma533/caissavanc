import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ControleDetailComponent } from './controle-detail.component';

describe('Controle Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControleDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ControleDetailComponent,
              resolve: { controle: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ControleDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load controle on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ControleDetailComponent);

      // THEN
      expect(instance.controle).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
