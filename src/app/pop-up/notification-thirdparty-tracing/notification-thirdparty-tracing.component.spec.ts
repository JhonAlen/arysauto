import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationThirdpartyTracingComponent } from './notification-thirdparty-tracing.component';

describe('NotificationThirdpartyTracingComponent', () => {
  let component: NotificationThirdpartyTracingComponent;
  let fixture: ComponentFixture<NotificationThirdpartyTracingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationThirdpartyTracingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationThirdpartyTracingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
