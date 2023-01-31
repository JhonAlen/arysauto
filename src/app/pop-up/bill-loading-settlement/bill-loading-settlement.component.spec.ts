import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillLoadingSettlementComponent } from './bill-loading-settlement.component';

describe('BillLoadingSettlementComponent', () => {
  let component: BillLoadingSettlementComponent;
  let fixture: ComponentFixture<BillLoadingSettlementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillLoadingSettlementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillLoadingSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
