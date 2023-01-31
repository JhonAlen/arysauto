import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetContractManagementVehicleComponent } from './fleet-contract-management-vehicle.component';

describe('FleetContractManagementVehicleComponent', () => {
  let component: FleetContractManagementVehicleComponent;
  let fixture: ComponentFixture<FleetContractManagementVehicleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetContractManagementVehicleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetContractManagementVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
