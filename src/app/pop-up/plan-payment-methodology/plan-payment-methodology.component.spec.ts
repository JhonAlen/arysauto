import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanPaymentMethodologyComponent } from './plan-payment-methodology.component';

describe('PlanPaymentMethodologyComponent', () => {
  let component: PlanPaymentMethodologyComponent;
  let fixture: ComponentFixture<PlanPaymentMethodologyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanPaymentMethodologyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanPaymentMethodologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
