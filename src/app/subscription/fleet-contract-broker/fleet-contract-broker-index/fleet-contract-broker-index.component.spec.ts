import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetContractBrokerIndexComponent } from './fleet-contract-broker-index.component';

describe('FleetContractBrokerIndexComponent', () => {
  let component: FleetContractBrokerIndexComponent;
  let fixture: ComponentFixture<FleetContractBrokerIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FleetContractBrokerIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FleetContractBrokerIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
