import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EffectuerDepenseComponent } from './effectuer-depense.component';

describe('EffectuerDepenseComponent', () => {
  let component: EffectuerDepenseComponent;
  let fixture: ComponentFixture<EffectuerDepenseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EffectuerDepenseComponent],
    });
    fixture = TestBed.createComponent(EffectuerDepenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
