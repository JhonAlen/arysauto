import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetContractManagementRealcoverageComponent } from './fleet-contract-management-realcoverage.component';

describe('FleetContractManagementRealcoverageComponent', () => {
  let component: FleetContractManagementRealcoverageComponent;
  let fixture: ComponentFixture<FleetContractManagementRealcoverageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FleetContractManagementRealcoverageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FleetContractManagementRealcoverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
