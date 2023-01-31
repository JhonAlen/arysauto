import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentRecordIndexComponent } from './payment-record-index.component';

describe('PaymentRecordIndexComponent', () => {
  let component: PaymentRecordIndexComponent;
  let fixture: ComponentFixture<PaymentRecordIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentRecordIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentRecordIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
