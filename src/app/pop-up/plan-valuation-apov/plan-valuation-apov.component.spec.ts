import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanValuationApovComponent } from './plan-valuation-apov.component';

describe('PlanValuationApovComponent', () => {
  let component: PlanValuationApovComponent;
  let fixture: ComponentFixture<PlanValuationApovComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanValuationApovComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanValuationApovComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
