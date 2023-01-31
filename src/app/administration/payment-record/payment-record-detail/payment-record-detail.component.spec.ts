import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentRecordDetailComponent } from './payment-record-detail.component';

describe('PaymentRecordDetailComponent', () => {
  let component: PaymentRecordDetailComponent;
  let fixture: ComponentFixture<PaymentRecordDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentRecordDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentRecordDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
