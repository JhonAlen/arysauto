import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionOrderFleetContractPaymentComponent } from './collection-order-fleet-contract-payment.component';

describe('CollectionOrderFleetContractPaymentComponent', () => {
  let component: CollectionOrderFleetContractPaymentComponent;
  let fixture: ComponentFixture<CollectionOrderFleetContractPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionOrderFleetContractPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionOrderFleetContractPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
