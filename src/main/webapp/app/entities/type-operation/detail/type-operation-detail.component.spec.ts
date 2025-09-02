import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { TypeOperationDetailComponent } from './type-operation-detail.component';

describe('TypeOperation Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeOperationDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: TypeOperationDetailComponent,
              resolve: { typeOperation: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(TypeOperationDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load typeOperation on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', TypeOperationDetailComponent);

      // THEN
      expect(instance.typeOperation).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
