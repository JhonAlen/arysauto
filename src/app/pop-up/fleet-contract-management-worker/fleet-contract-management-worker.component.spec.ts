import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetContractManagementWorkerComponent } from './fleet-contract-management-worker.component';

describe('FleetContractManagementWorkerComponent', () => {
  let component: FleetContractManagementWorkerComponent;
  let fixture: ComponentFixture<FleetContractManagementWorkerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetContractManagementWorkerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetContractManagementWorkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
