import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetContractManagementIndexComponent } from './fleet-contract-management-index.component';

describe('FleetContractManagementIndexComponent', () => {
  let component: FleetContractManagementIndexComponent;
  let fixture: ComponentFixture<FleetContractManagementIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetContractManagementIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetContractManagementIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
