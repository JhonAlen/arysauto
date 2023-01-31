import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationThirdpartyVehicleReplacementComponent } from './notification-thirdparty-vehicle-replacement.component';

describe('NotificationThirdpartyVehicleReplacementComponent', () => {
  let component: NotificationThirdpartyVehicleReplacementComponent;
  let fixture: ComponentFixture<NotificationThirdpartyVehicleReplacementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationThirdpartyVehicleReplacementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationThirdpartyVehicleReplacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
