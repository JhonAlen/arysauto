import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetContractManagementOwnerComponent } from './fleet-contract-management-owner.component';

describe('FleetContractManagementOwnerComponent', () => {
  let component: FleetContractManagementOwnerComponent;
  let fixture: ComponentFixture<FleetContractManagementOwnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetContractManagementOwnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetContractManagementOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
