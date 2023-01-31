import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationServiceOrderComponent } from './notification-service-order.component';

describe('NotificationServiceOrderComponent', () => {
  let component: NotificationServiceOrderComponent;
  let fixture: ComponentFixture<NotificationServiceOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationServiceOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationServiceOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
