import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetContractManagementInspectionComponent } from './fleet-contract-management-inspection.component';

describe('FleetContractManagementInspectionComponent', () => {
  let component: FleetContractManagementInspectionComponent;
  let fixture: ComponentFixture<FleetContractManagementInspectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetContractManagementInspectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetContractManagementInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
