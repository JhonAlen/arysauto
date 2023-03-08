import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanValuationExcesoComponent } from './plan-valuation-exceso.component';

describe('PlanValuationExcesoComponent', () => {
  let component: PlanValuationExcesoComponent;
  let fixture: ComponentFixture<PlanValuationExcesoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanValuationExcesoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanValuationExcesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
