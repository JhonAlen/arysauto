import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMethodologyDetailComponent } from './payment-methodology-detail.component';

describe('PaymentMethodologyDetailComponent', () => {
  let component: PaymentMethodologyDetailComponent;
  let fixture: ComponentFixture<PaymentMethodologyDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentMethodologyDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentMethodologyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
