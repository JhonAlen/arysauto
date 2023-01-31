import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetContractBrokerDetailComponent } from './fleet-contract-broker-detail.component';

describe('FleetContractBrokerDetailComponent', () => {
  let component: FleetContractBrokerDetailComponent;
  let fixture: ComponentFixture<FleetContractBrokerDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FleetContractBrokerDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FleetContractBrokerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
