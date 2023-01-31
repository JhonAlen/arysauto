import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetContractManagementDetailComponent } from './fleet-contract-management-detail.component';

describe('FleetContractManagementDetailComponent', () => {
  let component: FleetContractManagementDetailComponent;
  let fixture: ComponentFixture<FleetContractManagementDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetContractManagementDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetContractManagementDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
