import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationTypeServiceComponent } from './notification-type-service.component';

describe('NotificationTypeServiceComponent', () => {
  let component: NotificationTypeServiceComponent;
  let fixture: ComponentFixture<NotificationTypeServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationTypeServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationTypeServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
