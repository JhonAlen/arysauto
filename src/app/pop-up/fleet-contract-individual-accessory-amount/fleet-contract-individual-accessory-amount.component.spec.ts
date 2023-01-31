import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetContractIndividualAccessoryAmountComponent } from './fleet-contract-individual-accessory-amount.component';

describe('FleetContractIndividualAccessoryAmountComponent', () => {
  let component: FleetContractIndividualAccessoryAmountComponent;
  let fixture: ComponentFixture<FleetContractIndividualAccessoryAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FleetContractIndividualAccessoryAmountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FleetContractIndividualAccessoryAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
