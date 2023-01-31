import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeesRegisterVehicleTypeIntervalComponent } from './fees-register-vehicle-type-interval.component';

describe('FeesRegisterVehicleTypeIntervalComponent', () => {
  let component: FeesRegisterVehicleTypeIntervalComponent;
  let fixture: ComponentFixture<FeesRegisterVehicleTypeIntervalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeesRegisterVehicleTypeIntervalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeesRegisterVehicleTypeIntervalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
