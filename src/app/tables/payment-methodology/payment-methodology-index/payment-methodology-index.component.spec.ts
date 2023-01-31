import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMethodologyIndexComponent } from './payment-methodology-index.component';

describe('PaymentMethodologyIndexComponent', () => {
  let component: PaymentMethodologyIndexComponent;
  let fixture: ComponentFixture<PaymentMethodologyIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentMethodologyIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentMethodologyIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
