import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationVehicleComponent } from './notification-vehicle.component';

describe('NotificationVehicleComponent', () => {
  let component: NotificationVehicleComponent;
  let fixture: ComponentFixture<NotificationVehicleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationVehicleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
