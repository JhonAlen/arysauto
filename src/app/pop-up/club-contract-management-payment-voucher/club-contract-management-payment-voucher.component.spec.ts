import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubContractManagementPaymentVoucherComponent } from './club-contract-management-payment-voucher.component';

describe('ClubContractManagementPaymentVoucherComponent', () => {
  let component: ClubContractManagementPaymentVoucherComponent;
  let fixture: ComponentFixture<ClubContractManagementPaymentVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClubContractManagementPaymentVoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubContractManagementPaymentVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
