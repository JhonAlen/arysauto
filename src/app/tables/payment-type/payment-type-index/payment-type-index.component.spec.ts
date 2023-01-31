import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTypeIndexComponent } from './payment-type-index.component';

describe('PaymentTypeIndexComponent', () => {
  let component: PaymentTypeIndexComponent;
  let fixture: ComponentFixture<PaymentTypeIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentTypeIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentTypeIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
