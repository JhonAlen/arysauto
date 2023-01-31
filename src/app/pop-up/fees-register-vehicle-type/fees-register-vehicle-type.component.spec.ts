import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeesRegisterVehicleTypeComponent } from './fees-register-vehicle-type.component';

describe('FeesRegisterVehicleTypeComponent', () => {
  let component: FeesRegisterVehicleTypeComponent;
  let fixture: ComponentFixture<FeesRegisterVehicleTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeesRegisterVehicleTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeesRegisterVehicleTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
