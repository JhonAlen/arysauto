import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoadManagementConfigurationVehicleTypeComponent } from './road-management-configuration-vehicle-type.component';

describe('RoadManagementConfigurationVehicleTypeComponent', () => {
  let component: RoadManagementConfigurationVehicleTypeComponent;
  let fixture: ComponentFixture<RoadManagementConfigurationVehicleTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoadManagementConfigurationVehicleTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoadManagementConfigurationVehicleTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
