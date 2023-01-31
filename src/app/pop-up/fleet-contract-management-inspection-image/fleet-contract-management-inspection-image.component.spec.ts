import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetContractManagementInspectionImageComponent } from './fleet-contract-management-inspection-image.component';

describe('FleetContractManagementInspectionImageComponent', () => {
  let component: FleetContractManagementInspectionImageComponent;
  let fixture: ComponentFixture<FleetContractManagementInspectionImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetContractManagementInspectionImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetContractManagementInspectionImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
