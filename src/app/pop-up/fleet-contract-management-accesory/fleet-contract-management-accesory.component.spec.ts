import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetContractManagementAccesoryComponent } from './fleet-contract-management-accesory.component';

describe('FleetContractManagementAccesoryComponent', () => {
  let component: FleetContractManagementAccesoryComponent;
  let fixture: ComponentFixture<FleetContractManagementAccesoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetContractManagementAccesoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetContractManagementAccesoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
