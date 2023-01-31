import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationThirdpartyVehicleComponent } from './notification-thirdparty-vehicle.component';

describe('NotificationThirdpartyVehicleComponent', () => {
  let component: NotificationThirdpartyVehicleComponent;
  let fixture: ComponentFixture<NotificationThirdpartyVehicleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationThirdpartyVehicleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationThirdpartyVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
