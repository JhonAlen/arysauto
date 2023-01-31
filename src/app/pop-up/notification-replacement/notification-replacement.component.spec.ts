import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationReplacementComponent } from './notification-replacement.component';

describe('NotificationReplacementComponent', () => {
  let component: NotificationReplacementComponent;
  let fixture: ComponentFixture<NotificationReplacementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationReplacementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationReplacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
