import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationNotificationTypeDetailComponent } from './configuration-notification-type-detail.component';

describe('ConfigurationNotificationTypeDetailComponent', () => {
  let component: ConfigurationNotificationTypeDetailComponent;
  let fixture: ComponentFixture<ConfigurationNotificationTypeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationNotificationTypeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationNotificationTypeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
