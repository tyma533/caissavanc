import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeMotifComponent } from './demande-motif.component';

describe('DemandeMotifComponent', () => {
  let component: DemandeMotifComponent;
  let fixture: ComponentFixture<DemandeMotifComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemandeMotifComponent],
    });
    fixture = TestBed.createComponent(DemandeMotifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
