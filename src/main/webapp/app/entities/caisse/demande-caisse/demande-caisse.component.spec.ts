import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeCaisseComponent } from './demande-caisse.component';

describe('DemandeCaisseComponent', () => {
  let component: DemandeCaisseComponent;
  let fixture: ComponentFixture<DemandeCaisseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemandeCaisseComponent],
    });
    fixture = TestBed.createComponent(DemandeCaisseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
