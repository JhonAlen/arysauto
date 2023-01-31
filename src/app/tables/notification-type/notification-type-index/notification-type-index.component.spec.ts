import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationTypeIndexComponent } from './notification-type-index.component';

describe('NotificationTypeIndexComponent', () => {
  let component: NotificationTypeIndexComponent;
  let fixture: ComponentFixture<NotificationTypeIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationTypeIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationTypeIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
