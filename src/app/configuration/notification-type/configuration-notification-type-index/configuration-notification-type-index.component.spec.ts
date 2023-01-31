import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationNotificationTypeIndexComponent } from './configuration-notification-type-index.component';

describe('ConfigurationNotificationTypeIndexComponent', () => {
  let component: ConfigurationNotificationTypeIndexComponent;
  let fixture: ComponentFixture<ConfigurationNotificationTypeIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationNotificationTypeIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationNotificationTypeIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
