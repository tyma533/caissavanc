import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ModeOperationDetailComponent } from './mode-operation-detail.component';

describe('ModeOperation Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModeOperationDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ModeOperationDetailComponent,
              resolve: { modeOperation: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ModeOperationDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load modeOperation on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ModeOperationDetailComponent);

      // THEN
      expect(instance.modeOperation).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
