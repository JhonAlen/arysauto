import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationTracingComponent } from './notification-tracing.component';

describe('NotificationTracingComponent', () => {
  let component: NotificationTracingComponent;
  let fixture: ComponentFixture<NotificationTracingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationTracingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationTracingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
