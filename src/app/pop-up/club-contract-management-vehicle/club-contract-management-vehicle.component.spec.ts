import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubContractManagementVehicleComponent } from './club-contract-management-vehicle.component';

describe('ClubContractManagementVehicleComponent', () => {
  let component: ClubContractManagementVehicleComponent;
  let fixture: ComponentFixture<ClubContractManagementVehicleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClubContractManagementVehicleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubContractManagementVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
